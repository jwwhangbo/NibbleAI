"use server";
import { auth } from "@/auth";
import { pool as db } from "../utils/db";
import { PoolClient } from "@neondatabase/serverless";

export async function getFilteredUserSavedRecipes(query: string, userid: number) {
  const { rows } = await db.query('SELECT recipesid FROM collections WHERE userid=$1 AND name=$2', [userid, query]);
  const recipeids = rows[0].recipesid;
  if (!recipeids || recipeids.length < 1) {
    return {recipes: []};
  }
  const stmt = `
  SELECT json_agg(
    json_build_object(
      'id', r.id,
      'title', r.title,
      'thumbnail', r.thumbnail,
      'description', r.description,
      'instructions', r.instructions,
      'date_created', r.date_created,
      'date_updated', r.date_updated,
      'public', r.public,
      'ingredients', r.ingredients,
      'info', r.info,
      'category', r.category,
      'user', json_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email,
        'image', u.image
      )
    )
  ) as recipes
  FROM collections c
  LEFT JOIN recipes r ON r.id = ANY(c.recipesid)
  LEFT JOIN users u ON r.userid = u.id
  WHERE c.userid = $1 
  AND c.name ILIKE $2
  GROUP BY c.id;
  `;

  const result = await db.query(stmt, [userid, query]);
  return result.rows[0];
}

export async function getUserCollections(userid: number) {
  const stmt = `
    SELECT id, name
    FROM collections c
    WHERE c.userid=$1
  `;
  const result = await db.query(stmt, [userid]);
  return result.rows;
}

export async function getAllUserSavedRecipes(userId: number) {
  const stmt = `
    SELECT array_agg(recipesid) AS saved_recipes
    FROM collections
    WHERE userid = $1 
    AND recipesid IS NOT NULL
    AND array_length(recipesid, 1) > 0
    GROUP BY userid
    ;
  `;
  const result = await db.query(stmt, [userId]);
  return result.rows[0]?.saved_recipes[0] ?? [];
}

/**
 * updates user collection 'NC' to include recipeId
 * @param recipeId
 */
export async function addRecipetoNocategory(recipeId: number): Promise<void> {
  const session = await auth();
  const userid = session?.user.id;
  const client = await db.connect();
  try {
    // first check if row 'NC' exists for user
    await client.query('BEGIN');
    const queryResult = await client.query(
      `SELECT * FROM collections WHERE userid=$1 AND name='No Category'`,
      [userid]
    );
    if ((queryResult.rowCount ?? 0) <= 0) {
      await client.query(
        "INSERT INTO collections (userid, name, recipesid) VALUES ($1, $2, $3);",
        [userid, "No Category", []]
      );
    }
    const stmt = `UPDATE collections SET recipesId = array_append(recipesId, $1) WHERE userid = $2 AND name='No Category';`;
    const values = [recipeId, userid];
    await client.query(stmt, values);
    await client.query('COMMIT');
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.release();
  }
}

export async function removeLikedRecipe(recipeId: number) {
  const session = await auth();
  const userid = session?.user.id;

  const stmt = `
  UPDATE collections
  SET recipesid = array_remove(recipesid, $1)
  WHERE userid = $2 AND $1 = ANY(recipesid);
`;
  const values = [recipeId, userid];
  await db.query(stmt, values);
}

export async function addNewCollection(collectionName: string, client?: PoolClient) {
  const session = await auth();
  const userid = session?.user.id;

  const query = "INSERT INTO collections (userid, name, recipesid) VALUES ($1, $2, $3)"
  const values = [userid, collectionName, []]
  const queryPromise = client ? client.query(query, values) : db.query(query, values);
  await queryPromise;
}
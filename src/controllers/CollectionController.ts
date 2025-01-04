"use server";
import { auth } from "@/auth";
import { pool as db } from "../utils/db";

export async function getUserCollections(userid: number) {
  const stmt = `
    SELECT c.userid, c.name, json_agg(r.*) as recipes
    FROM collections c
    LEFT JOIN recipes r
    ON r.id = ANY(c.recipesid)
    WHERE c.userid=$1
    GROUP BY c.id;
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
  // first check if row 'NC' exists for user
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

  await client.release();
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

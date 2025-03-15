"use server";
import { pool as db } from "@/src/utils/db";
import { type Recipe } from "@/lib/types";
import { auth } from "@/auth";
import { PoolClient } from "@neondatabase/serverless";
import { GeneratedRecipe, GenerateUserRecipes } from "./AiController";

/**
 * returns the generated recipe ids for a user
 * @param userid - required user primary key id
 * @returns
 */
export async function getGeneratedRecipes(
  userid: number
): Promise<number[] | undefined> {
  const query = `
  SELECT recipesid
  FROM recipes_generated
  WHERE userId = $1;
`;
  const results = await db.query(query, [userid]);
  if (results.rows.length > 0) {
    return results.rows[0].recipesid;
  }
}

export async function getAllUserRecipes() {
  const session = await auth();
  if (!session) {
    throw new Error("Not Authorized");
  }
  const query = `
    SELECT *
    FROM recipes
    WHERE userId=$1;
  `;
  const result = await db.query(query, [session.user.id]);
  return result.rows;
}

/**
 * retrieves recipe from database
 * @param {number} recipeId
 * @returns
 */
export async function getRecipe(recipeId: number, client?: PoolClient) {
  const query = `
    SELECT *
    FROM recipes
    WHERE id = $1;
  `;
  const results = client
    ? await client.query(query, [recipeId])
    : await db.query(query, [recipeId]);
  return results.rows[0];
}
/**
 * matches the db against search keyword and returns results
 * @param query
 * @param currentPage
 */
export async function fetchQueriedRecipes(query: string, currentPage: number) {
  if (!query.trim()) {
    return []; // Return an empty array if the query is an empty string or only whitespace
  }

  const offset = (currentPage - 1) * 6;

  const stmt = `
    SELECT r.*, AVG(rt.rating_stars) as average_rating
    FROM recipes r
    LEFT JOIN recipes_ratings rt
    ON rt.recipeid=r.id
    WHERE
      r.title ILIKE $1 OR
      r.description ILIKE $1 OR
      EXISTS (SELECT 1 FROM unnest(r.instructions) AS instruction WHERE instruction->> 'instruction' ILIKE $1::text) OR
      EXISTS (SELECT 1 FROM unnest(r.ingredients) AS ingredient WHERE ingredient->>'ingredient' ILIKE $1)
    GROUP BY 
      r.id
    ORDER BY r.id ASC
    LIMIT 6 OFFSET $2
  ;`;
  const results = await db.query(stmt, [`%${query}%`, offset]);
  return results.rows;
}

export async function fetchRecipesPages(query: string): Promise<number> {
  if (!query.trim()) {
    return 0; // Return an empty array if the query is an empty string or only whitespace
  }
  const stmt = `
    SELECT *
    FROM recipes r
    WHERE
      r.title ILIKE $1 OR
      r.description ILIKE $1 OR
      EXISTS (SELECT 1 FROM unnest(r.instructions) AS instruction WHERE instruction->> 'instruction' ILIKE $1::text) OR
      EXISTS (SELECT 1 FROM unnest(r.ingredients) AS ingredient WHERE ingredient->>'ingredient' ILIKE $1)
  `;
  const results = await db.query(stmt, [`%${query}%`]);
  return results.rowCount ? Math.ceil(results.rowCount / 6) : 1;
}

async function generateAndSaveRecipes(
  userId: number,
  client: PoolClient
): Promise<number[]> {
  const generatedRecipes = await GenerateUserRecipes(userId, client);
  if (!generatedRecipes) {
    throw Error("Something went wrong");
  }
  const recipes: GeneratedRecipe["recipes"] =
    JSON.parse(generatedRecipes).recipes;

  const formattedRecipes: Recipe[] = recipes.map((recipe) => ({
    userid: 1,
    info: recipe.recipe_information,
    category: recipe.recipe_category,
    title: recipe.recipe_name,
    thumbnail: "",
    description: recipe.recipe_description,
    ingredients: recipe.major_ingredients,
    instructions: recipe.detailed_instruction,
    date_created: new Date(),
    public: true,
  }));

  const insertIds = await addRecipe(formattedRecipes, client);

  const results = await client.query(
    "SELECT * FROM recipes_generated WHERE userId = $1 FOR UPDATE",
    [userId]
  );
  if (results.rows.length === 0) {
    // user recipe_generated row is not found but not critical, so insert new row
    await client.query(
      "INSERT INTO recipes_generated (userId, recipesId) VALUES ($1, $2)",
      [userId, insertIds]
    );
  } else {
    await client.query(
      "UPDATE recipes_generated SET recipesId=$1 where userId=$2",
      [insertIds, userId]
    );
  }
  return Array.isArray(insertIds) ? insertIds : [insertIds];
}

export async function getOrGenerateRecipeIds(
  userId: number
): Promise<number[]> {
  const generatedRecipes = await getGeneratedRecipes(userId);
  if (!generatedRecipes) {
    const client = await db.connect();
    try {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[${new Date().toISOString()}] generating new recipes for user ${userId}`
        );
      }
      client.query("BEGIN");
      const insertIds = await generateAndSaveRecipes(userId, client);
      client.query("COMMIT");
      return insertIds;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      await client.release();
    }
  }
  const generatedIds = await getGeneratedRecipes(userId);
  return generatedIds ?? [];
}
/**
 * removes deprecated recipes based on ids retrieved from recipes_generated
 */
export async function RegenerateRecipeIds() {
  const session = await auth();
  const userId = session?.user?.id;
  if (process.env.NODE_ENV === "development") {
    console.log(`[${new Date().toISOString()}] regenerating recipe ids`);
  }
  const client = await db.connect();
  try {
    await client.query(
      "UPDATE recipes_generated SET is_fetching=true where userId=$1",
      [userId]
    );
    client.query("BEGIN");
    // Lock row to prevent concurrent modifications
    const { rows } = await client.query(
      "SELECT * FROM recipes_generated WHERE userId=$1",
      [userId]
    );
    if (rows.length === 0) {
      throw Error("User not found");
    }
    await generateAndSaveRecipes(userId, client);
    client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.query(
      "UPDATE recipes_generated SET is_fetching=false where userId=$1",
      [userId]
    );
    await client.release();
  }
}

export async function removeRecipe(
  recipeId: number,
  client?: PoolClient
): Promise<void> {
  const session = await auth();
  // create new client instance for transaction
  const localClient = client ?? (await db.connect());
  // Query user data from recipes db and match with session userid
  try {
    let query = "SELECT userid FROM recipes where id=$1";
    const result = await localClient.query(query, [recipeId]);
    const userid = result.rows[0].userid;
    if (session?.user.id !== userid) {
      throw new Error("Permission denied");
    }
    query = "DELETE FROM recipes WHERE id=$1";
    await localClient.query(query, [recipeId]);
  } catch (error) {
    await localClient.query("ROLLBACK");
    throw error;
  } finally {
    await localClient.release();
  }
}

export async function addRecipe(
  recipe: Recipe | Recipe[],
  client?: PoolClient
): Promise<number | number[]> {
  const session = await auth();
  const recipes = Array.isArray(recipe) ? recipe : [recipe];

  if (!session) {
    throw Error("Unauthorized Approach");
  }
  const query = `
    INSERT INTO recipes (userid, title, category, info, thumbnail, description, ingredients, instructions, date_created, public)
    VALUES ${recipes
      .map(
        (_, i) =>
          `($${i * 10 + 1}, $${i * 10 + 2}, $${i * 10 + 3}, $${i * 10 + 4}, $${
            i * 10 + 5
          }, $${i * 10 + 6}, $${i * 10 + 7}, $${i * 10 + 8}, $${i * 10 + 9}, $${
            i * 10 + 10
          })`
      )
      .join(", ")}
  RETURNING id`;

  const values = recipes.flatMap((recipe) => [
    recipe.userid,
    recipe.title,
    recipe.category,
    recipe.info ?? null,
    recipe.thumbnail,
    recipe.description,
    recipe.ingredients,
    recipe.instructions,
    new Date(),
    recipe.public,
  ]);

  const results = client
    ? await client.query(query, values)
    : await db.query(query, values);

  const ids = results.rows.map((row) => row.id);

  return Array.isArray(recipe) ? ids : ids[0];
}

export async function updateRecipe(
  recipeId: number,
  recipe: Recipe,
  client?: PoolClient
) {
  const stmt = `UPDATE recipes 
     SET title=$1, thumbnail=$2, description=$3, ingredients=$4, instructions=$5, date_updated=now(), public=$6, category=$7, info=$8
     WHERE id = $9;`;
  const values = [
    recipe.title,
    recipe.thumbnail,
    recipe.description,
    recipe.ingredients,
    recipe.instructions,
    recipe.public,
    recipe.category,
    recipe.info ?? null,
    recipeId,
  ];
  const queryPromise = client
    ? client.query(stmt, values)
    : db.query(stmt, values);
  await queryPromise;
}

export async function getGeneratingStatus(userid: number) {
  const { rows } = await db.query(
    "SELECT is_fetching FROM recipes_generated WHERE userid=$1",
    [userid]
  );
  return rows[0]?.is_fetching;
}

export async function getAllRecipeIds(): Promise<number[]> {
  const { rows } = await db.query("SELECT array_agg(id) as ids FROM recipes");
  return rows[0]?.ids ?? [];
}

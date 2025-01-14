"use server";
import { pool as db } from "@/src/utils/db";
import { type Recipe } from "@/lib/types";
import { auth } from "@/auth";
import { PoolClient } from "@neondatabase/serverless";
import { GenerateUserRecipes } from "./AiController";

/**
 * returns the generated recipe ids for a user
 * @param userid - required user primary key id
 * @returns
 */
async function getGeneratedRecipes(userid: number) {
  const query = `
  SELECT r.*
  FROM recipes r
  JOIN recipes_generated rg ON r.id = ANY(rg.recipesId)
  WHERE rg.userId = $1;
`;
  const values = [userid];

  const results = await db.query(query, values);
  return results.rows;
}

export async function getAllUserRecipes() {
  const session = await auth();
  if (!session) {throw new Error('Not Authorized')}
  const query = `
    SELECT *
    FROM recipes
    WHERE userId=$1;
  `
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

  const stmt = `
    SELECT r.*, AVG(rt.rating_stars) as average_rating
    FROM recipes r
    LEFT JOIN recipes_ratings rt
    ON rt.recipeid=r.id
    WHERE
      r.title ILIKE $1 OR
      r.description ILIKE $1 OR
      EXISTS (SELECT 1 FROM unnest(r.instructions) AS instruction WHERE instruction ILIKE $1) OR
      EXISTS (SELECT 1 FROM unnest(r.ingredients) AS ingredient WHERE ingredient->>'ingredient' ILIKE $1)
    GROUP BY 
      r.id
    ORDER BY r.id ASC
    LIMIT 6 OFFSET $2
  ;`;
  const results = await db.query(stmt, [`%${query}%`, currentPage]);
  return results.rows;
}

export async function fetchRecipesPages(query: string) : Promise<number> {
  if (!query.trim()) {
    return 0; // Return an empty array if the query is an empty string or only whitespace
  }
  const stmt = `
    SELECT *
    FROM recipes r
    WHERE
      r.title ILIKE $1 OR
      r.description ILIKE $1 OR
      EXISTS (SELECT 1 FROM unnest(r.instructions) AS instruction WHERE instruction ILIKE $1) OR
      EXISTS (SELECT 1 FROM unnest(r.ingredients) AS ingredient WHERE ingredient->>'ingredient' ILIKE $1)
  `;
  const results = await db.query(stmt,[`%${query}%`])
  return results.rowCount ? Math.ceil(results.rowCount / 6) : 1;
}

export async function fetchGeneratedRecipes(userId : number) {
  const generatedRecipes = await getGeneratedRecipes(userId);
  const time = new Date();
  if (generatedRecipes.length === 0) {
    const recipes = JSON.parse(await GenerateUserRecipes(userId)).recipes;
    const client = await db.connect();
    const insertIds: number[] = [];

    for (const recipe of recipes) { // Cast generated recipes into db format
      const recipeDbFormat: Recipe = {
        userId: 1,
        info: recipe.recipe_information,
        category: recipe.recipe_category,
        title: recipe.recipe_name,
        images: [],
        description: recipe.recipe_description,
        ingredients: recipe.major_ingredients,
        instructions: recipe.detailed_instruction,
        date_created: time,
        public: true,
      };
      const recipeId = await addRecipe(recipeDbFormat, client);
      insertIds.push(recipeId);
    }
    const results = await client.query(
      "SELECT recipesid FROM recipes_generated WHERE userId = $1",
      [userId]
    );
    if (results.rows.length === 0) {
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
    client.release();
  }
  return await getGeneratedRecipes(userId);
}
/**
 * removes deprecated recipes based on ids retrieved from recipes_generated
 */
export async function ResetGeneratedRecipeIds() {
  const session = await auth();
  const userId = session?.user?.id;
  const client = await db.connect();
  const result = await client.query(
    "SELECT recipesId FROM recipes_generated WHERE userId=$1",
    [userId]
  );
  if (result.rows[0].recipesid.length !== 0) {
    await client.query(
      "UPDATE recipes_generated SET recipesId=$1 where userId=$2",
      [[], userId]
    );
  }
}

export async function removeRecipe(
  recipeId: number,
  client?: PoolClient
): Promise<void> {
  const query = "DELETE FROM recipes WHERE id=$1";
  const values = [recipeId];

  if (client) {
    await client.query(query, values);
  } else {
    await db.query(query, values);
  }
}

export async function addRecipe(
  recipe: Recipe,
  client?: PoolClient
): Promise<number> {
  const query = `
    INSERT INTO recipes (userid, title, category, info, images, description, ingredients, instructions, date_created, public)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  RETURNING id`;
  const values = [
    recipe.userId,
    recipe.title,
    recipe.category,
    recipe.info ?? null,
    recipe.images,
    recipe.description,
    recipe.ingredients,
    recipe.instructions,
    recipe.date_created,
    recipe.public,
  ];
  const results = client
    ? await client.query(query, values)
    : await db.query(query, values);

  return results.rows[0]?.id;
}

export async function updateRecipe(recipeId: number, recipe: Recipe) {
  const stmt = `UPDATE recipes 
     SET title=$1, images=$2, description=$3, ingredients=$4, instructions=$5, date_updated=NOW(), public=$6 
     WHERE id = $7;`;
  const values = [
    recipe.title,
    recipe.images,
    recipe.description,
    recipe.ingredients,
    recipe.instructions,
    recipe.public,
    recipeId,
  ];

  await db.query(stmt, values);
}

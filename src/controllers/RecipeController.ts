"use server";
import { pool as db } from "@/src/utils/db";
import { type Recipe } from "@/lib/types";
import { auth } from "@/auth";
import { PoolClient } from "@neondatabase/serverless";
import { GenerateUserRecipes } from "./AiController";

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

export async function fetchGeneratedRecipes() {
  const session = await auth();
  const userId = session?.user?.id;
  const generatedRecipes = await getGeneratedRecipes(userId);
  if (generatedRecipes.length === 0) {
    const recipes = JSON.parse(await GenerateUserRecipes(userId)).recipes;
    const client = await db.connect();
    const insertIds : number[] = [];
    for (let recipe of recipes) {
      const recipeDbFormat : Recipe = {
        recipe_name: recipe.recipe_name,
        images: [],
        recipe_description: recipe.recipe_description,
        major_ingredients: recipe.major_ingredients,
        detailed_instruction: recipe.detailed_instruction,
        public: true
      }
      const recipeId = await addRecipe(1, recipeDbFormat, client);
      insertIds.push(recipeId);
    }
    const results = await client.query('SELECT recipesid FROM recipes_generated WHERE userId = $1', [userId]);
    if (results.rows.length === 0) {
      await client.query('INSERT INTO recipes_generated (userId, recipesId) VALUES ($1, $2)', [userId, insertIds]);
    }
    else {
      await client.query('UPDATE recipes_generated SET recipesId=$1 where userId=$2', [insertIds, userId]);
    }
    client.release();
  }
  return await getGeneratedRecipes(userId);
}

export async function addRecipe(userid : number, recipe: Recipe, client? : PoolClient) : Promise<number> {
    const query = `
    INSERT INTO recipes (userid, title, images, description, ingredients, instructions, date_created, public)
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
  RETURNING id`;
    const values = [
      userid,
      recipe.recipe_name,
      recipe.images,
      recipe.recipe_description,
      recipe.major_ingredients,
      recipe.detailed_instruction,
      recipe.public
    ];
    const results = client ? await client.query(query, values) : await db.query(query, values);

  return results.rows[0]?.id;
}

export async function updateRecipe(recipeId : number, recipe : Recipe) {
    const stmt = 
    `UPDATE recipes 
     SET title=$1, images=$2, description=$3, ingredients=$4, instructions=$5, date_updated=NOW(), public=$6 
     WHERE id = $7;`;
    const values = [recipe.recipe_name, recipe.images, recipe.recipe_description, recipe.major_ingredients, recipe.detailed_instruction, recipe.public, recipeId];

    await db.query(stmt, values);
}

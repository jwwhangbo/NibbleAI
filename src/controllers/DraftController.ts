"use server";

import { Recipe, RecipeDraft } from "@/lib/types";
import { pool as db } from "@/src/utils/db";
import { PoolClient } from "@neondatabase/serverless";
import { addRecipe, updateRecipe } from "./RecipeController";

/**
 * Retrieves a draft from the database based on the provided recipe ID.
 *
 * @param {number} recipeId - The ID of the recipe to retrieve the draft for.
 * @param {PoolClient} [client] - Optional database client to use for the query.
 * @returns {Promise<any>} A promise that resolves to the draft object corresponding to the given recipe ID.
 */
export async function getDraftFromRecipeId(
  recipeId: number,
  client?: PoolClient
) {
  const query = `
    SELECT * 
    FROM recipe_drafts
    WHERE recipe_id=$1
  `;
  const queryPromise = client
    ? client.query(query, [recipeId])
    : db.query(query, [recipeId]);
  const result = await queryPromise;

  if (result.rows.length === 0) {
    return null; // or throw an error, or return a default value
  }

  return result.rows[0];
}

/**
 * Adds a draft entry to the `recipe_drafts` table using the provided recipe ID and recipe data.
 *
 * @param {number} recipeId - The ID of the recipe to create a draft for.
 * @param {Recipe} recipeData - An object containing the recipe data to be inserted.
 * @param {PoolClient} [client] - An optional database client to use for the query. If not provided, a default client will be used.
 * @returns {Promise<any>} A promise that resolves to the inserted draft row.
 */
export async function addDraftFromRecipeId(
  recipeId: number,
  recipeData: Recipe & { id: number },
  client?: PoolClient
) {
  // Destructure and remove unnecessary properties
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {id,public: isPublic,date_updated,date_created,...cleanedRecipeData} = recipeData;

  const columns = Object.keys(cleanedRecipeData).join(", ");
  const values = Object.values(cleanedRecipeData);
  const placeholders = values.map((_, index) => `$${index + 3}`).join(", ");
  const now = new Date().toISOString();

  const query = `
    INSERT INTO recipe_drafts (recipe_id, last_saved, ${columns})
    VALUES ($1, $2, ${placeholders})
    RETURNING *
  `;

  const queryPromise = client
    ? client.query(query, [recipeId, now, ...values])
    : db.query(query, [recipeId, now, ...values]);
  const result = await queryPromise;
  return result.rows[0];
}

/**
 * Saves a draft of a recipe to the database.
 *
 * @param {Recipe} recipe - The recipe data to be saved. The `date_created`, `date_updated`, and `public` fields are excluded from the update.
 * @param {number} draftId - The ID of the draft to be updated.
 * @param {PoolClient} [client] - Optional database client to use for the query. If not provided, the default database client will be used.
 * @returns {Promise<string>} - A promise that resolves to the timestamp of when the draft was last saved.
 */
export async function saveDraft(
  recipeData: RecipeDraft,
  draftId: number,
  client?: PoolClient
): Promise<string> {
  // Destructure and remove unnecessary properties
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userid, last_saved, ...cleanedRecipeData } = recipeData;

  const columns = Object.keys(cleanedRecipeData);
  const values = Object.values(cleanedRecipeData);
  const setClause = columns
    .map((col, index) => `${col} = $${index + 1}`)
    .join(", ");
  const query = `
    UPDATE recipe_drafts
    SET last_saved = now(), ${setClause}
    WHERE id = $${columns.length + 1}
    RETURNING last_saved
    `;

  const queryPromise = client
    ? client.query(query, [...values, draftId])
    : db.query(query, [...values, draftId]);
  const result = await queryPromise;
  return result.rows[0]?.last_saved;
}

export async function addEmptyDraftFromUserId(userid: number) {
  const query = `
    INSERT INTO recipe_drafts (userid, last_saved)
    VALUES ($1, now())
    RETURNING id
  `;
  const result = await db.query(query, [userid]);
  return result.rows[0];
}

export async function getDraftFromId(id: number, client?: PoolClient) {
  const query = `
    SELECT *
    FROM recipe_drafts
    WHERE id=$1
  `;

  const queryPromise = client
    ? client.query(query, [id])
    : db.query(query, [id]);
  const result = await queryPromise;
  return result.rows[0];
}

export async function getUserDrafts(userId: number, client?: PoolClient) {
  const query = `
    SELECT id, title, last_saved
    FROM recipe_drafts
    WHERE userid=$1
  `;
  const queryPromise = client
    ? client.query(query, [userId])
    : db.query(query, [userId]);
  const result = await queryPromise;
  return result.rows;
}

export async function uploadDraftToRecipes(
  draftData: RecipeDraft,
  draftId: number
) {
  const client = await db.connect();
  // check if draftData is tied to a recipeId
  try {
    await client.query('BEGIN');
    const fetchQuery = `
      SELECT recipe_id FROM recipe_drafts WHERE id=$1
    `;
    const result = await client.query(fetchQuery, [draftId]);
    let recipe_id = result.rows[0].recipe_id;
    if (recipe_id) {
      updateRecipe(
        recipe_id,
        { date_created: new Date(), public: true, ...draftData },
        client
      );
    } else {
      recipe_id = addRecipe(
        { date_created: new Date(), public: true, ...draftData },
        client
      );
    }
    // cleanup draft
    await deleteDraft(draftId, client);
    await client.query('COMMIT');
    return recipe_id;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.release();
  }
}

export async function deleteDraft(draftId: number, client?: PoolClient) {
  const query = `
    DELETE FROM recipe_drafts WHERE id=$1
  `;
  const resultPromise = client ? client.query(query, [draftId]) : db.query(query, [draftId]);
  await resultPromise;
}

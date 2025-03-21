"use server";
import { pool as db } from "@/src/utils/db";
import type { PoolClient } from "@neondatabase/serverless";
import type { Comment } from "@/lib/types";
import { auth } from "@/auth";

export async function hasUserRatedRecipe(recipeid: number, client?: PoolClient) {
  const session = await auth();
  if (!session) {
    throw Error("Unauthorized Access");
  }
  const userid = session.user.id;
  const query = "SELECT * FROM recipes_ratings WHERE recipeid=$1 AND userid=$2";
  const queryPromise = client
    ? client.query(query, [recipeid, userid])
    : db.query(query, [recipeid, userid]);
  const { rows } = await queryPromise;
  return rows.length > 0;
}

/**
 * Retrieves ratings for a given recipe ID from the database.
 *
 * @param {number} recipeid - The ID of the recipe to retrieve ratings for.
 * @param {PoolClient} [client] - Optional database client to use for the query.
 * @returns {Promise<Comment[]>} A promise that resolves to an array of rating objects.
 */
export async function getRatingsFromRecipeId(
  recipeid: number,
  client?: PoolClient
): Promise<(Comment & { id: number })[]> {
  const query = "SELECT * FROM recipes_ratings WHERE recipeid=$1 ORDER BY date_created DESC";
  const queryPromise = client
    ? client.query(query, [recipeid])
    : db.query(query, [recipeid]);

  return (await queryPromise).rows as ((Comment&{id:number})[]);
}

export async function getRatingCountForUserId(userid: number, client?: PoolClient) {
  const query = "SELECT count(*) as recipe_count FROM recipes_ratings WHERE userid=$1";
  const queryPromise = client
    ? client.query(query, [userid])
    : db.query(query, [userid]);

  const { rows } = await queryPromise;
  return rows[0].recipe_count ?? 0;
}

export async function addRatingsWithRecipeId(
  recipeid: number,
  rating: { rating_stars: number; rating_description: string },
  client?: PoolClient
) {
  const session = await auth();
  if (!session) {
    throw Error("Unauthorized Access");
  }
  const userid = session.user.id;
  const query =
    "INSERT INTO recipes_ratings (date_created, userid, recipeid, rating_stars, rating_description) VALUES (now(), $1, $2, $3, $4) RETURNING id";
  const queryPromise = client
    ? client.query(query, [
        userid,
        recipeid,
        rating.rating_stars,
        rating.rating_description,
      ])
    : db.query(query, [
        userid,
        recipeid,
        rating.rating_stars,
        rating.rating_description,
      ]);

  const { rows } = await queryPromise;
  return rows[0].id;
}

export async function updateRatingsWithRatingId(
  ratingid: number,
  rating: { rating_stars: number; rating_description?: string},
  client? : PoolClient
) {
  const session = await auth();
  if (!session) {
    throw Error("Unauthorized Access");
  }
  const conditions=[];
  const values=[];

  if (rating.rating_description) {
    conditions.push(`rating_description=$${conditions.length + 1}`);
    values.push(rating.rating_description);
  } else {
    conditions.push(`rating_description=$${conditions.length + 1}`);
    values.push(null);
  }
  conditions.push(`rating_stars=$${conditions.length + 1}`);
  values.push(rating.rating_stars);

  const query = `UPDATE recipes_ratings SET date_updated=now(), ${conditions.join(', ')}`;
  const queryPromise = client ? client.query(query, values) : db.query(query, values);
  await queryPromise;
}

export async function getRecipeRatingAvgAndCount(recipeid: number) {
  const query = "SELECT COUNT(*) as ratings_count, AVG(rating_stars) as average_rating FROM recipes_ratings WHERE recipeid=$1 GROUP BY recipeid";
  const { rows } = await db.query(query, [recipeid]);
  return rows[0] ?? { average_rating: 0, ratings_count: 0 };
}
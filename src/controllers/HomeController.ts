import { pool as db } from "@/src/utils/db";

export async function getHomePageData() {
  const query = `
    SELECT *
    FROM home
  `;
  const { rows } = await db.query(query);
  return rows[0];
}

export async function getTrendingRecipes(interval: Date, limit: number) {
  const query = `
    WITH recipes_ratings_recent AS (
      SELECT recipeid, AVG(rating_stars) AS average_rating_recent
      FROM recipes_ratings 
      WHERE (date_updated IS NOT NULL AND date_updated > $1) OR (date_updated IS NULL AND date_created > $1)
      GROUP BY recipeid
    )
    SELECT recipes.id, average_rating_recent, COALESCE(date_updated, date_created) AS final_date
    FROM recipes 
    LEFT JOIN recipes_ratings_recent rr ON recipes.id = rr.recipeid
    ORDER BY average_rating_recent ASC, final_date DESC
    LIMIT $2;
  `;
  const { rows } = await db.query(query, [interval, limit]);
  return rows;
}

export async function getRecentRatings(
  interval: Date,
  limit: number
): Promise<
  {
    userid: number;
    recipeid: number;
    rating_description: string;
    final_date: Date;
  }[]
> {
  const query = `
    SELECT userid, recipeid, rating_description, COALESCE(date_updated, date_created) AS final_date
    FROM recipes_ratings 
    WHERE (date_updated IS NOT NULL AND date_updated > $1) OR (date_updated IS NULL AND date_created > $1)
      AND rating_description IS NOT NULL
      AND rating_description <> ''
    ORDER BY final_date DESC
    LIMIT $2
  `;
  const { rows } = await db.query(query, [interval, limit]);
  return rows;
}

export async function getAITrendingRecipes(interval: Date, limit: number) {
  const query = `
    WITH recipes_ratings_recent AS (
      SELECT recipeid, AVG(rating_stars) AS average_rating_recent
      FROM recipes_ratings 
      WHERE (date_updated IS NOT NULL AND date_updated > $1) OR (date_updated IS NULL AND date_created > $1)
      GROUP BY recipeid
    )
    SELECT recipes.id, average_rating_recent, COALESCE(date_updated, date_created) AS final_date
    FROM recipes 
    LEFT JOIN recipes_ratings_recent rr ON recipes.id = rr.recipeid
    WHERE recipes.userid=1
    ORDER BY average_rating_recent ASC, final_date DESC
    LIMIT $2;
  `;
  const { rows } = await db.query(query, [interval, limit]);
  return rows;
}

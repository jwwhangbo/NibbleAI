"use server";
import { auth } from "@/auth";
import { pool as db } from "@/src/utils/db"

export async function getGeneratedRecipes(userid : number) {
  const stmt = "SELECT r.* FROM recipes r JOIN recipes_generated rg ON r.id = ANY(rg.recipesId) WHERE rg.userId = $1";
  const values = [userid];

  const results = await db.query(stmt, values);
  return results.rows;
}

export async function updateGeneratedRecipes() {
  const session = await auth();
  const userid = session?.user.id;

  const client = await db.connect(); // new client for db transactions
  client.on('error', (err) => {throw err;})

  try {
    const stmt = "UPDATE users SET preference = $1 WHERE id = $2";
    const values = [userid];

    await client.query(stmt, values);
  } catch (err) {
    throw err;
    // TODO: handle server error
  } finally {
    client.release();
  }
}

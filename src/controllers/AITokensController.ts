"use server";

import { auth } from "@/auth";
import { pool as db } from "@/src/utils/db";
import { PoolClient } from "@neondatabase/serverless";

const TOKEN_CAP = 5; // Maximum tokens
const TOKEN_REPLENISH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour (changeable)

/**
 * Retrieves the available tokens and the time until the next token replenishment for the authenticated user.
 *
 * This function performs the following steps:
 * 1. Authenticates the user session.
 * 2. Connects to the database and locks the user's token row to prevent concurrent modifications.
 * 3. Calculates the number of tokens that should have replenished since the last update.
 * 4. Updates the token count and last updated time in the database if tokens have replenished.
 * 5. Calculates the time in seconds until the next token replenishment if the token count is below the cap.
 * 6. Commits the transaction and returns the available tokens and the time until the next token replenishment.
 *
 * @throws {Error} If the user is not authenticated or if the user is not found in the database.
 * @returns {Promise<{tokens: number, secondsUntilNextToken: number}>} An object containing the available tokens and the time in seconds until the next token replenishment.
 */
export async function getUserTokenStatusUpdateOnCall(client?: PoolClient) {
  const session = await auth();
  if (!session) {
    throw Error("Authorization Error");
  }
  const userId = session.user.id;
  const localClient = client ? client : await db.connect();
  try {
    await localClient.query("BEGIN");

    // Lock row to prevent concurrent modifications
    const { rows } = await localClient.query(
      `SELECT tokens, used FROM users_tokens WHERE id = $1 FOR UPDATE`,
      [userId]
    );

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    const result = rows[0];
    let tokens = result.tokens;
    const last_updated = result.used;
    let lastUpdatedTime = new Date(last_updated).getTime();
    const now = new Date().getTime();

    // Calculate how many tokens should have replenished
    const elapsedIntervals = Math.floor(
      (now - lastUpdatedTime) / TOKEN_REPLENISH_INTERVAL_MS
    );
    if (elapsedIntervals > 0) {
      tokens = Math.min(TOKEN_CAP, tokens + elapsedIntervals); // Update token count
      // Reset last updated time
      lastUpdatedTime =
        tokens < TOKEN_CAP
          ? lastUpdatedTime + elapsedIntervals * TOKEN_REPLENISH_INTERVAL_MS
          : now;

      // Update the database
      await localClient.query(
        `UPDATE users_tokens SET tokens = $1, used = $2 WHERE id = $3`,
        [tokens, new Date(lastUpdatedTime), userId]
      );
    }

    // ✅ Correctly calculate next token replenishment countdown
    let secondsUntilNextToken = 0;
    if (tokens < TOKEN_CAP) {
      const nextTokenTime = lastUpdatedTime + TOKEN_REPLENISH_INTERVAL_MS;
      secondsUntilNextToken = Math.max(
        Math.floor((nextTokenTime - now) / 1000),
        0
      );
    }

    await localClient.query("COMMIT");

    return {
      tokens,
      secondsUntilNextToken,
    };
  } catch (error) {
    await localClient.query("ROLLBACK");
    throw error;
  } finally {
    localClient.release();
  }
}

/**
 * Deducts a token from the user's account.
 * 
 * This function performs the following steps:
 * 1. Authenticates the user session.
 * 2. Connects to the database.
 * 3. Begins a database transaction.
 * 4. Retrieves the user's current token status.
 * 5. Deducts one token from the user's account if they have sufficient tokens.
 * 6. Updates the user's token count in the database.
 * 7. Commits the transaction if successful, otherwise rolls back the transaction in case of an error.
 * 
 * @throws {Error} If the user is not authenticated.
 * @throws {Error} If the user has insufficient tokens.
 * @throws {Error} If there is an error during the database transaction.
 */
export async function deductToken(client?: PoolClient) {
  const session = await auth();
  if (!session) {
    throw Error("Authorization Error");
  }
  const userId = session.user.id;
  const localClient = client ? client : await db.connect();
  try {
    await localClient.query("BEGIN");
    const {tokens, } = await getUserTokenStatusUpdateOnCall();
    if (tokens < 1) {
      throw Error('Insufficient tokens');
    }
    const remainingTokens = Math.max(0, tokens - 1);
    if (tokens < TOKEN_CAP) { // leaves last used time intact
      const query = `
        UPDATE users_tokens SET tokens=$1 WHERE id=$2
      `
      await localClient.query(query, [remainingTokens, userId]);
    }
    else { // updates last used time
      const query = `
        UPDATE users_tokens SET tokens=$1, used=now() WHERE id=$2
      `
      await localClient.query(query, [remainingTokens, userId]);
    }
    await localClient.query('COMMIT');
  } catch (error) {
    await localClient.query("ROLLBACK");
    throw error;
  } finally {
    await localClient.release();
  }
}

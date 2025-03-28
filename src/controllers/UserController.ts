'use server';
import { GenerateUserPreference } from "./AiController";
import { ResponseBody } from "@/lib/types";
import { auth } from "@/auth";
import { pool as db } from "../utils/db";
import { PoolClient } from "@neondatabase/serverless";

export async function updateUserImage(userid: string, imageUrl: string | void | null ) {
  const stmt = `
  UPDATE users
  SET image=$1 
  WHERE id=$2;`;
  await db.query(stmt, [imageUrl, userid]);
}

export async function getUserInfo(userid: number, client?: PoolClient) {
  const query = 'SELECT name, email, image FROM users WHERE id=$1'
  const result = client ? client.query(query, [userid]) : db.query(query, [userid]);
  return (await result).rows[0];
}

export async function updateUserPreference(responseBody: ResponseBody) {
  const session = await auth();
  const userid = session?.user.id;
  const dataBody = await GenerateUserPreference(responseBody)
  try {
    const stmt = "UPDATE users SET preference = $1 WHERE id = $2";
    const values = [dataBody, userid];

    await db.query(stmt, values);
  } catch (err) {
    throw err; 
    // TODO: handle error
  }
}

export async function updateUsername(userid: string, name: string) {
  const query = "UPDATE users SET name = $1 WHERE id = $2";
  await db.query(query, [name, userid]);
}

export async function getUserPreference(userid: number, client?: PoolClient) : Promise<Record<string, unknown>> {
  try {
    const stmt = "SELECT preference FROM users WHERE id = $1";

    const queryPromise = client ? client.query(stmt, [userid]) : db.query(stmt, [userid]);
    const res = await queryPromise
    return res.rows[0]?.preference;
  } catch (err) {
    throw err;
    // TODO: handle error
  }
}
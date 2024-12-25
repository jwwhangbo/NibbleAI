'use server';
import { GenerateUserPreference } from "./AiController";
import { ResponseBody } from "@/lib/types";
import { auth } from "@/auth";
import { pool } from "../utils/db";

export async function updateUserPreference(responseBody: ResponseBody) {
  const session = await auth();
  const userid = session?.user.id;
  const dataBody = await GenerateUserPreference(responseBody)
  try {
    const stmt = "UPDATE users SET preference = $1 WHERE id = $2";
    const values = [dataBody, userid];

    await pool.query(stmt, values);
  } catch (err) {
    throw err; 
    // TODO: handle error
  }
}

export async function getUserPreference(userid: number) : Promise<Record<string, unknown>> {
  const session = await auth();
  // const userid = session?.user.id;

  try {
    const stmt = "SELECT preference FROM users WHERE id = $1";
    const values = [userid];

    const res = await pool.query(stmt, values);
    return res.rows[0]?.preference;
  } catch (err) {
    throw err;
    // TODO: handle error
  }
}
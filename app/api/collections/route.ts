import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { getFilteredUserSavedRecipes } from "@/src/controllers/CollectionController";

export const GET = auth(async function (req) {
  if (!req.auth) return new NextResponse('Unauthorized', {status: 401});
  const session = req.auth;
  const queryUrl = new URL(req.nextUrl);
  const query = queryUrl.searchParams.get('query');
  if (!query) return new NextResponse('Query not set', {status: 400});
  
  const rows = await getFilteredUserSavedRecipes(query, session.user.id);
  return NextResponse.json(rows[0]);
}) 
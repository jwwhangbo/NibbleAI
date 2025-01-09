import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
// import { getFilteredUserSavedRecipes } from "@/src/controllers/CollectionController";

export const POST = auth(function GET (req) {
  if (req.auth) return NextResponse.json(req.auth)
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
}) 
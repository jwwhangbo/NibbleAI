import { getGeneratingStatus } from "@/src/controllers/RecipeController";
import { auth } from "@/auth";

export const revalidate = 5;

export async function GET() {
  const session = await auth();
  if (!session) {
    // return res.status(401).json({ error: "Not Authorized" });
    return new Response(JSON.stringify({ error: "Not Authorized" }), { status: 401 });
  }

  const userId = session.user.id;
  const status = await getGeneratingStatus(userId);

  return Response.json({isFetching: status});
}
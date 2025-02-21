import { getRecipe } from "@/src/controllers/RecipeController";
import NewRecipeForm from "@/components/recipes/NewRecipeForm";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const recipeId = (await searchParams).id;
  const recipeData = await getRecipe(parseInt(recipeId));
  const session = await auth();
  if (session?.user.id !== recipeData.userid) {
    throw Error("Unauthorized Access")
  }

  return (
    <div className="px-4 sm:px-[30px] space-y-4">
      <h1 className="font-bold text-2xl py-2">Edit Recipe</h1>
      <SessionProvider session={session}>
        <NewRecipeForm recipeData={recipeData} />
      </SessionProvider>
    </div>
  );
}

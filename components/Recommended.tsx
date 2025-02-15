"use server";
import RecipeCard from "./ui/generatedRecipecard";
import { fetchGeneratedRecipes } from "@/src/controllers/RecipeController";
import RefreshButton from "./ui/RefreshButton";
import { auth } from "@/auth";
import { getAllUserSavedRecipes } from "@/src/controllers/CollectionController";

export default async function Recommended() {
  const session = await auth();
  const userid = session?.user?.id;
  const recipes = await fetchGeneratedRecipes(userid);
  const favorites = await getAllUserSavedRecipes(userid);
  
  return (
    <div className="w-full flex flex-col gap-3 justify-center">
      <div className="flex justify-between items-center py-2">
        <h2 className="text-2xl h-fit font-bold">Recommended Recipes</h2>
        <RefreshButton />
      </div>
      <div className="flex flex-row flex-wrap sm:flex-nowrap gap-[16px] justify-center">
        {recipes?.map((recipe) => {
          return <RecipeCard key={recipe.id} saved={favorites.includes(recipe.id)} {...recipe} />;
        })}
      </div>
    </div>
  );
}

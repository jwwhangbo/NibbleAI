"use server";
import RecipeCard from "./ui/recipeCard";
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
    <div className="w-full flex flex-col justify-center">
      <div className="flex justify-between">
        <h2 className="text-2xl">Recommended Recipes</h2>
        <RefreshButton />
      </div>
      <div className="flex flex-row flex-wrap gap-[16px] max-w-[500px] md:max-w-none md:w-full justify-center md:justify-start">
        {recipes?.map((recipe) => {
          return <RecipeCard key={recipe.id} saved={favorites.includes(recipe.id)} {...recipe} />;
        })}
      </div>
    </div>
  );
}

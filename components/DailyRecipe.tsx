'use server'
import RecipeCard from "./ui/recipeCard";
import { fetchGeneratedRecipes } from "@/src/controllers/RecipeController";

export default async function DailyRecipe() {
  const recipes = await fetchGeneratedRecipes();
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-row flex-wrap gap-[16px] max-w-[500px] md:max-w-none md:w-full justify-center md:justify-start">
        {recipes?.map((recipe, index) => {
          return <RecipeCard key={index} {...recipe} />;
        })}
      </div>
    </div>
  );
}
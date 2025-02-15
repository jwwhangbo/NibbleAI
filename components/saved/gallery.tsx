"use client";

import { Recipe } from "@/lib/types";
import RecipeCard from "@/components/saved/recipecard"
import { useNavbarStore } from "@/src/providers/navbar-store-provider";
import { useSearchParams } from "next/navigation";

export default function SavedGallery({
  recipes,
}: {
  recipes: (Recipe & { id: string } & {
    user?: {
      id: number;
      name: string;
      email: string;
      image: string;
    };
  })[];
} & React.HTMLAttributes<HTMLDivElement>) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query')
  function filterRecipesByQuery(recipe: Recipe, query: string): boolean {
    const lowerCaseQuery = query.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(lowerCaseQuery) ||
      recipe.category?.categoryA?.toLowerCase().includes(lowerCaseQuery) ||
      recipe.category?.categoryB?.toLowerCase().includes(lowerCaseQuery) ||
      (recipe.category?.dietary && recipe.category.dietary.toLowerCase().includes(lowerCaseQuery)) ||
      recipe.description.toLowerCase().includes(lowerCaseQuery) ||
      recipe.ingredients.some(ingredient =>
        ingredient.ingredient.toLowerCase().includes(lowerCaseQuery)
      ) ||
      recipe.instructions.some(instruction =>
        instruction.step.toLowerCase().includes(lowerCaseQuery)
      )
    );
  }
  if (searchQuery) {
    recipes = recipes.filter(recipe => filterRecipesByQuery(recipe, searchQuery));
  }
  const { active } = useNavbarStore((state) => state);
  return (
    <div className={`flex flex-wrap gap-4`}>
      {recipes?.map((recipe, index: number) => (
        <RecipeCard
          variant={active ? "list" : "portrait"}
          recipe={recipe}
          key={index}
        />
      ))}
    </div>
  );
}

"use client";

import { Recipe } from "@/lib/types";
import RecipeCard from "@/components/saved/recipecard"
import { useNavbarStore } from "@/src/providers/navbar-store-provider";

export default function SavedGallery({
  recipes,
}: {
  recipes: (Recipe & { id: string } & {
    user: {
      id: number;
      name: string;
      email: string;
      image: string;
    };
  })[];
} & React.HTMLAttributes<HTMLDivElement>) {
  const { active } = useNavbarStore((state) => state);
  return (
    <div className="flex flex-wrap gap-4">
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

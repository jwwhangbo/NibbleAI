import { Recipe } from "@/lib/types";

interface RecipeCardProps {
  collection: {
    id: number;
    name: string;
    recipes: ({ id: number } & Recipe)[];
  };
}

export default function RecipeCard({ collection }: RecipeCardProps) {
  return (
    <div key={`c-${collection.id}`}>
      <p>{collection.name}</p>
      {collection.recipes.map((recipe: { id: number } & Recipe) => {
        return (
          <div key={`r-${recipe.id}`}>
            <p>{recipe.title}</p>
          </div>
        );
      })}
    </div>
  );
}
 
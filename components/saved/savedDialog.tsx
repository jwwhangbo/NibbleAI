import { Recipe } from "@/lib/types";
import RecipeCard from "./recipecard";

interface SavedDialogProps {
  collections: {
    id: number;
    name: string;
    recipes: ({ id: number } & Recipe)[];
  }[];
}

export default function SavedDialog({ collections }: SavedDialogProps) {
  return (
    <>
      {collections.map((collection) => (
        <RecipeCard key={`c-${collection.id}`} collection={collection} />
      ))}
    </>
  );
}

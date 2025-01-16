import { auth } from "@/auth";
import SavedGallery from "@/components/saved/gallery";
import { Recipe } from "@/lib/types";
import { getFilteredUserSavedRecipes } from "@/src/controllers/CollectionController";
import { getAllUserRecipes } from "@/src/controllers/RecipeController";

export default async function Page({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized request");
  }
  
  const collection = (await params).collection;

  if (collection === "myrecipe") {
    const userRecipes = await getAllUserRecipes();
    return (
      <div className="w-full">
        {userRecipes.length < 1 ? (
          <p>No recipes found.</p>
        ) : (
          <ul>
            {userRecipes.map((recipe) => (
              <li key={recipe.id}>{recipe.name}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  const result = await getFilteredUserSavedRecipes(
    decodeURIComponent(collection),
    session.user.id
  );
  const recipes: (Recipe & { id: string } & {
    user: {
      id: number;
      name: string;
      email: string;
      image: string;
    };
  })[] = result.recipes;
  return (<div className="mt-2 overflow-y-scroll h-full"><SavedGallery recipes={recipes} /></div>);
}

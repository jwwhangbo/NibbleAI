import { auth } from "@/auth";
import { Recipe } from "@/lib/types";
import { getFilteredUserSavedRecipes } from "@/src/controllers/CollectionController";
import { getAllUserRecipes } from "@/src/controllers/RecipeController"

export default async function Page({ params } : { params: Promise<{ collection:string}>}) {
  const collection = (await params).collection;
  if (collection === 'myrecipe') {
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
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized request")
  }
  const result = await getFilteredUserSavedRecipes(decodeURIComponent(collection), session.user.id);
  const recipes : (Recipe & {id: number})[] = result[0].recipes;
  return (
    <div className="flex flex-col">
      {!recipes.length ? <p>No Recipes Found</p> :
      <div>{recipes.map((recipe) => <p key={`recipe-${recipe.id}`}>{recipe.title}</p>)}</div>}
    </div>
  );
}

"use server";
import { auth } from "@/auth";
import {
  getAllUserSavedRecipes,
  getUserCollections,
} from "@/src/controllers/CollectionController";
import SavedDialog from "@/components/saved/savedDialog";

export default async function Page() {
  const session = await auth();
  const userid = session?.user?.id;
  const savedrecipes = await getAllUserSavedRecipes(userid);
  if (savedrecipes.length <= 0) {
    return (
      <div className="h-[calc(100vh-56px)]">
        <p className="opacity-60 relative top-1/2 w-full text-center">
          No Recipes Saved Yet! Try adding more recipes
        </p>
      </div>
    );
  }
  const collections = await getUserCollections(userid);
  return (
    <div className="px-[17px] pt-2">
      <h1 className="text-3xl">Saved Recipes</h1>
      <SavedDialog collections={collections} />
    </div>
  );
}

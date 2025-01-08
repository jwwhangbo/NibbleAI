"use server";
import { auth } from "@/auth";
import {
  getAllUserSavedRecipes,
  getUserCollections,
} from "@/src/controllers/CollectionController";

export default async function Page({ searchParams } : { searchParams: Promise<{ p?: string }>}) {
  const { p } = await searchParams;
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
    <div className="px-[17px] flex flex-col pt-2 h-[calc(100dvh-56px)]">
      <h1 className="text-3xl">Saved Recipes</h1>
      <div className="grow w-full border-2 border-black">
        <div className="w-[150px] h-[calc(100%-2rem)] my-4 border-r-2">
          <ul className="flex flex-col gap-1 *:text-center">
            <li><button className="w-full h-full border-2 border-black py-2">My Recipes</button></li>
            <li><button className="w-full h-full border-2 border-black py-2">Saved Recipes</button></li>
            {collections.map((collection) => {
              if (collection.name !== "No Category") {
                return (<li key={`c-${collection.id}`}>{collection.name}</li>);
            }
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}

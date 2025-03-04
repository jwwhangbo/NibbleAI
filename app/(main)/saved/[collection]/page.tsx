import { auth } from "@/auth";
import GalleryActionBar from "@/components/saved/Actionbar";
import SavedGallery from "@/components/saved/gallery";
import { Recipe } from "@/lib/types";
import { getFilteredUserSavedRecipes } from "@/src/controllers/CollectionController";
import { getAllUserRecipes } from "@/src/controllers/RecipeController";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";

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
      <div className="w-full h-full mt-2 overflow-y-scroll">
        {userRecipes.length < 1 ? (
          <div className="w-full h-full flex flex-col justify-center items-center gap-3">
            <p>No recipes found.</p>
            <Link
              href="/recipes/add"
              className="uppercase flex items-center justify-between leading-none text-[16px] gap-0.5 select-none border border-black rounded-md px-3 py-2 font-semibold tracking-tight text-gray-500 border-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="size-4 relative"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              new recipe{" "}
            </Link>
          </div>
        ) : (
          <div className="relative h-full w-full">
            <SavedGallery recipes={userRecipes} />
            <SessionProvider session={session}>
              <GalleryActionBar />
            </SessionProvider>
          </div>
        )}
      </div>
    );
  }

  const result = await getFilteredUserSavedRecipes(
    decodeURIComponent(collection),
    session.user.id
  );
  if (!result) {
    return (
      <div>
        <p>You don&apos;t have any saved recipes yet!</p>
      </div>
    );
  }

  const recipes: (Recipe & { id: string } & {
    user: {
      id: number;
      name: string;
      email: string;
      image: string;
    };
  })[] = result.recipes;
  return (
    <div className="mt-2 overflow-y-scroll h-full">
      <SavedGallery recipes={recipes} />
    </div>
  );
}

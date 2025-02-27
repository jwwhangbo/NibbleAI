"use server";
import { auth } from "@/auth";
import UserProfileSkeleton from "@/components/skeletons/UserProfileSkeleton";
import NavbarUserProfile from "@/components/ui/userProfile";
import { Recipe } from "@/lib/types";
import { getRecipe } from "@/src/controllers/RecipeController";
import { getUserInfo } from "@/src/controllers/UserController";
import Image from "next/image";
import { Suspense } from "react";
import DeleteButtonWithDialog from "@/components/recipes/DeleteButtonWithDialog";
import Link from "next/link";

const NavbarUserProfileWrapper = async ({
  userid,
  ...props
}: { userid: number } & React.HTMLAttributes<HTMLDivElement>) => {
  const userInfo = await getUserInfo(userid);
  return <NavbarUserProfile {...props} user={userInfo} />;
};

export default async function Page(props: {
  searchParams: Promise<{ id: number | undefined }>;
}) {
  const recipeId = (await props.searchParams)?.id;
  if (!recipeId) {
    throw new Error("Could not find recipe");
  }

  const recipe: Recipe & { id: string } = await getRecipe(recipeId);
  if (!recipe || !recipe.public) {
    throw new Error("Could not find recipe");
  }

  const session = await auth();

  return (
    <div className="px-[17px] mt-[20px] flex flex-col space-y-3">
      <div className="flex flex-col sm:flex-row gap-4">
        {recipe.thumbnail && (
          <Image
            src={recipe.thumbnail}
            alt="recipe thumbnail"
            width={200}
            height={200}
            className="w-full grow basis-1/2"
          />
        )}
        <div className="grow basis-1/2 flex flex-col justify-center gap-6 pr-4 pb-6 sm:pb-0">
          <h1 className="text-4xl font-bold">{recipe.title}</h1>
          <h3>{recipe.description}</h3>
          <Suspense fallback={<UserProfileSkeleton className="w-fit" />}>
            <NavbarUserProfileWrapper
              className="w-fit"
              userid={recipe.userid}
            />
          </Suspense>
          {session && session.user.id === recipe.userid && (
            <div className="rounded-md flex *:px-4 *:py-2 border-2 border-gray-300 w-fit overflow-hidden">
              <Link
                className="hover:bg-orange-100"
                href={`recipes/edit?id=${recipe.id}`}
              >
                Edit
              </Link>
              <DeleteButtonWithDialog recipeId={recipe.id} />
            </div>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Recipe Information</h2>
        <p>
          <strong>Prep Time </strong>
          {recipe.info?.total_time || ""} <strong>Yields</strong>{" "}
          {recipe.info?.servings || ""}
        </p>
      </div>
      <div className="py-5 flex flex-col space-y-3">
        <h2 className="text-2xl font-bold">Ingredients</h2>
        <ul className="list-disc list-inside indent-4">
          {recipe.ingredients.map(
            (entry: { ingredient: string; quantity: string; unit: string }, index) => (
              <li key={`${entry.ingredient}-${index}`}>
                {entry.ingredient} {entry.quantity} {entry.unit}
              </li>
            )
          )}
        </ul>
      </div>
      <h2 className="text-2xl font-bold">Instructions</h2>
      <ol className="list-none list-inside indent-4 space-y-4">
        {recipe.instructions.map((entry, index: number) => (
          <li key={index}>
            <div className="flex flex-col w-full justify-between items-center space-y-4 text-justify">
              <div className="w-full space-x-2">
                <span className="font-bold">{`Step ${index + 1}.`}</span>
                <span>{entry.step}</span>
              </div>
              {!!entry.image && (
                <Image
                  src={entry.image}
                  alt={"image"}
                  height={200}
                  width={200}
                  style={{ width: "100%", maxWidth: "800px", flexGrow: 1 }}
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

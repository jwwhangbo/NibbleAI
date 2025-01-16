"use server";
import UserProfileSkeleton from "@/components/skeletons/UserProfileSkeleton";
import NavbarUserProfile from "@/components/ui/userProfile";
import { getRecipe } from "@/src/controllers/RecipeController";
import { getUserInfo } from "@/src/controllers/UserController";
import { Suspense } from "react";

const NavbarUserProfileWrapper = async ({userid, ...props} : {userid: number} & React.HTMLAttributes<HTMLDivElement>) => {
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

  const recipe = await getRecipe(recipeId);
  if (!recipe || !recipe.public) {
    throw new Error("Could not find recipe");
  }

  return (
    <div className="px-[17px] mt-[20px]">
      <h1 className="text-4xl">{recipe.title}</h1>
      <h3>{recipe.description}</h3>
      <p>written by</p>
      <Suspense fallback={<UserProfileSkeleton className="w-fit"/>}>
        <NavbarUserProfileWrapper className="w-fit" userid={recipe.userid}/>
      </Suspense>
      <h2 className="text-2xl">Recipe Information</h2>
      <p><strong>Prep Time </strong>{recipe.info?.total_time || ""} <strong>Yields</strong> {recipe.info?.servings || ""}</p>
      <h2 className="text-2xl">Ingredients</h2>
      <ul className="list-disc list-inside indent-4">
        {recipe.ingredients.map(
          (entry: { ingredient: string; quantity: number; unit: string }) => (
            <li key={entry.ingredient}>
              {entry.ingredient} {entry.quantity} {entry.unit}
            </li>
          )
        )}
      </ul>
      <h2 className="text-2xl">Instructions</h2>
      <ol className="list-decimal list-inside indent-4">
        {recipe.instructions.map((entry: string, index: number) => (
          <li key={index}>{entry}</li>
        ))}
      </ol>
    </div>
  );
}

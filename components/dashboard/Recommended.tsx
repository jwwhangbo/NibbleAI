import RecipeCard from "../ui/generatedRecipecard";
import {
  getOrGenerateRecipeIds,
  getRecipe,
} from "@/src/controllers/RecipeController";
import RefreshButton from "../ui/RefreshButton";
import { auth } from "@/auth";
import { getAllUserSavedRecipes } from "@/src/controllers/CollectionController";
import { Suspense } from "react";
import RecipeCardSkeleton from "../skeletons/generatedRecipeCardSkeleton";
import TokenUI from "@/components/ui/AITokenUI";
import { getUserTokenStatusUpdateOnCall } from "@/src/controllers/AITokensController";

export default async function Recommended() {
  const session = await auth();
  const userid = session?.user.id;
  const recipeIdArray = await getOrGenerateRecipeIds(userid);
  const savedRecipes = await getAllUserSavedRecipes(userid);
  const tokensData = await getUserTokenStatusUpdateOnCall();

  return (
    <div className="w-full flex flex-col gap-3 justify-center">
      <div className="flex justify-between items-center py-2">
        <h2 className="text-2xl h-fit font-bold">Recommended Recipes</h2>
        <div className="flex gap-2">
          <TokenUI tokensData={tokensData}/>
          <RefreshButton />
        </div>
      </div>
      <div className="flex flex-row flex-wrap sm:flex-nowrap gap-[16px] justify-center">
        {recipeIdArray?.map((id) => {
          const recipeDataPromise = getRecipe(id);
          return (
            <Suspense key={id} fallback={<RecipeCardSkeleton />}>
              <RecipeCard
                saved={savedRecipes.includes(id)}
                recipeDataPromise={recipeDataPromise}
              />
            </Suspense>
          );
        })}
      </div>
    </div>
  );
}

import { auth } from "@/auth";
import Recommended from "@/components/dashboard/Recommended";
import RecommendedSkeleton from "@/components/skeletons/RecommendedSkeleton";
import { getOrGenerateRecipeIds } from "@/src/controllers/RecipeController";
import { Suspense } from "react";

export default async function Page() {
  const session = await auth();
  const generatedRecipeIds = await getOrGenerateRecipeIds(session?.user.id);
  const key = generatedRecipeIds ? generatedRecipeIds.join(",") : "";
  return (
    <div className="px-[17px] pt-2">
      <Suspense key={key} fallback={<RecommendedSkeleton />}>
        <Recommended />
      </Suspense>
    </div>
  );
}

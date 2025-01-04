import LoadingIndicator from "../ui/LoadingIndicator";
import RecipeCardSkeleton from "./recipeCardSkeleton";

export default function DailyRecipeSkeleton() {
  return (
    <div className="w-full flex flex-col justify-center relative">
      <div className="flex justify-between max-w-[848px]">
        <h2 className="text-2xl h-[44px]">Recommended Recipes</h2>
      </div>
      <div className="flex flex-row flex-wrap gap-[16px] max-w-[500px] md:max-w-none md:w-full justify-center md:justify-start">
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
      </div>
      <div className="absolute flex justify-center items-center inset-0">
        <div className="flex flex-col gap-2 justify-center items-center m-auto py-4 px-8 bg-white rounded-lg">
          <p className="">fetching recipes</p>
          <LoadingIndicator className="w-[32px] h-[32px]"/>
        </div>
      </div>
    </div>
  );
}
import RecipeCardSkeleton from "./recipeCardSkeleton";

export default function DailyRecipeSkeleton() {
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-row flex-wrap gap-[16px] max-w-[500px] md:max-w-none md:w-full justify-center md:justify-start">
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
      </div>
    </div>
  );
}
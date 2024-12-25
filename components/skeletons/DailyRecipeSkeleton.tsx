import RecipeCardSkeleton from "../ui/recipeCardSkeleton";

export default function DailyRecipeSkeleton() {
  return (<div className="flex flex-row flex-wrap gap-[16px]">
    <RecipeCardSkeleton />
    <RecipeCardSkeleton />
    <RecipeCardSkeleton />
    <RecipeCardSkeleton />
  </div>);
}
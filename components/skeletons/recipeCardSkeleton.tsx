export default function RecipeCardSkeleton() {
  return (
    <div className="grow animate-pulse flex flex-col gap-4 w-full sm:w-auto">
      <div className="w-full aspect-[5/3] bg-gray-500"></div>
      <div className="flex flex-col gap-4">
        <div className="w-full h-[15px] bg-gray-500 rounded-lg"></div>
        <div className="w-[160px] h-[15px] mb-7 bg-gray-500 rounded-lg"></div>
        <div className="w-full h-[10px] bg-gray-500 rounded-lg"></div>
        <div className="w-full h-[10px] bg-gray-500 rounded-lg"></div>
      </div>
    </div>
  );
}

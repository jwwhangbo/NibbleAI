export default function RecipeCardSkeleton() {
  return (
    <div className="w-full max-w-[162px] min-[380px]:max-w-[170px] lg:max-w-[200px] md:h-[300px] rounded-md">
      <div className="animate-pulse flex flex-col gap-2">
        <div className="w-full h-[103px] bg-gray-500"></div>
        <div className="flex flex-col gap-2">
          <div className="w-[160px] h-[15px] bg-gray-500 rounded-lg"></div>
          <div className="w-[160px] h-[15px] bg-gray-500 rounded-lg"></div>
          <div className="w-[160px] h-[10px] bg-gray-500 rounded-lg"></div>
          <div className="w-[160px] h-[10px] bg-gray-500 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
export default function RecipeCardSkeleton() {
  return (
    <div className="w-[183px] h-[191px] rounded-md">
      <div className="animate-pulse flex flex-col gap-2">
        <div className="w-[183px] h-[103px] bg-gray-500"></div>
        <div className="px-[5px] flex flex-col gap-2">
          <div className="w-[160px] h-[15px] bg-gray-500 rounded-lg"></div>
          <div className="w-[160px] h-[15px] bg-gray-500 rounded-lg"></div>
          <div className="w-[160px] h-[10px] bg-gray-500 rounded-lg"></div>
          <div className="w-[160px] h-[10px] bg-gray-500 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
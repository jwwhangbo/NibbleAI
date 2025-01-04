export default function TableSkeleton() {
  return (
    <div className="flex flex-col gap-2 pt-4 animate-pulse sm:flex sm:flex-col sm:gap-4">
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <div className="w-full sm:w-[200px] h-[200px] bg-gray-500 shrink-0"></div>
        <div className="w-full flex flex-col gap-2">
          <div className="w-5/6 h-[25px] bg-gray-500 rounded-lg"></div>
          <div className="w-full h-[10px] bg-gray-500 rounded-md"></div>
          <div className="w-full h-[10px] bg-gray-500 rounded-md"></div>
          <div className="w-3/4 h-[10px] bg-gray-500 rounded-md"></div>
        </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <div className="w-full sm:w-[200px] h-[200px] bg-gray-500 shrink-0"></div>
        <div className="w-full flex flex-col gap-2">
          <div className="w-5/6 h-[25px] bg-gray-500 rounded-lg"></div>
          <div className="w-full h-[10px] bg-gray-500 rounded-md"></div>
          <div className="w-full h-[10px] bg-gray-500 rounded-md"></div>
          <div className="w-3/4 h-[10px] bg-gray-500 rounded-md"></div>
        </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row gap-2">
        <div className="w-full sm:w-[200px] h-[200px] bg-gray-500 shrink-0"></div>
        <div className="w-full flex flex-col gap-2">
          <div className="w-5/6 h-[25px] bg-gray-500 rounded-lg"></div>
          <div className="w-full h-[10px] bg-gray-500 rounded-md"></div>
          <div className="w-full h-[10px] bg-gray-500 rounded-md"></div>
          <div className="w-3/4 h-[10px] bg-gray-500 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
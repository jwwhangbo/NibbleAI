export default function UserProfileSkeleton (props : React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <div className="flex justify-center items-center gap-2 w-fit m-auto animate-pulse">
        <div className="rounded-full w-[32px] h-[32px] bg-gray-500"></div>
        <div className="w-[150px] h-[15px] rounded-lg bg-gray-500"></div>
      </div>
    </div>
  );
}

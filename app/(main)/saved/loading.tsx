import LoadingIndicator from "@/components/ui/LoadingIndicator";

export default function Loading() {
  return (
    <div className="px-[17px] pt-2 w-full h-full">
      <div className="mt-4 flex w-full h-full justify-center items-center gap-2">
        <LoadingIndicator className="w-[32px] h-[32px] -z-10" />
        <h2 className="text-2xl">Loading...</h2>
      </div>
    </div>
  );
}

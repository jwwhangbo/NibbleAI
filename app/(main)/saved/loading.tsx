import LoadingIndicator from "@/components/ui/LoadingIndicator";

export default function Loading() {
  return (
    <div className="px-[17px] pt-2">
      <h1 className="text-3xl">Saved Recipes</h1>
      <div className="mt-4 flex w-full justify-center items-center gap-2">
        <LoadingIndicator className="w-[32px] h-[32px]" />
        <h2 className="text-2xl ">Loading...</h2>
      </div>
    </div>
  );
}

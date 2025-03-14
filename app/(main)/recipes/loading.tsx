import LoadingIndicator from "@/components/ui/LoadingIndicatorBouncing";

export default function Loading() {
  return <div className="w-fit pt-6 mx-auto">
    <LoadingIndicator className="w-fit text-orange-300" />
  </div>;
}
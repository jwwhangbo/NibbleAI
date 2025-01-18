import Recommended from "@/components/Recommended";
import DailyRecipeSkeleton from "@/components/skeletons/DailyRecipeSkeleton";
import { Suspense } from "react";

export default async function Page() {
  return (
    <div className="px-[17px] pt-2">
      <Suspense key={Math.random()} fallback={<DailyRecipeSkeleton />}>
        {/* I can't for the love of god figure out a better way to make this happen...
          * okay.. this needs to be fixed to prevent hydration errors...
          */}
        <Recommended />
      </Suspense>
    </div>
  );
}

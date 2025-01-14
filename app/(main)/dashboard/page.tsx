import { signOut } from "@/auth";
import Recommended from "@/components/Recommended";
import DailyRecipeSkeleton from "@/components/skeletons/DailyRecipeSkeleton";
import { Suspense } from "react";

export default async function Page() {
  return (
    <div className="px-[17px]">
      <Suspense key={Math.random()} fallback={<DailyRecipeSkeleton />}>
        {/* I can't for the love of god figure out a better way to make this happen...*/}
        <Recommended />
      </Suspense>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/signin" });
        }}
      >
        <button type="submit">sign out</button>
      </form>
    </div>
  );
}

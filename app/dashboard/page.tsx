import { signOut } from "@/auth"
import DailyRecipe from "@/components/DailyRecipe";
import DailyRecipeSkeleton from "@/components/skeletons/DailyRecipeSkeleton";
import { Suspense } from "react";

export default async function Page() {
    return (
      <div className="px-[17px] bg-gray-200">
        <h2 className="text-2xl">Recommended Recipes</h2>
        <Suspense fallback={<DailyRecipeSkeleton />}>
            <DailyRecipe />
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
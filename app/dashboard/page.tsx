import { signOut } from "@/auth"
import DailyRecipeSkeleton from "@/components/skeletons/DailyRecipeSkeleton";

export default async function Page() {
    return (
      <div className="h-[1200px] bg-gray-200">
        <span>welcome!</span>
        <DailyRecipeSkeleton />
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
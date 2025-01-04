'use client'
import { ResetGeneratedRecipeIds } from "@/src/controllers/RecipeController";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import LoadingIndicator from "./LoadingIndicator";

export default function RefreshButton() {
  const [, action, isPending] = useActionState(async() => {
    await ResetGeneratedRecipeIds();
    nextrouter.refresh();
  }, null)
  const nextrouter = useRouter()
  return (
    <form
      action={action}>
      <button
        className="flex justify-center items-center w-[150px] h-[50px] border-2 border-black rounded-md disabled:bg-gray-500"
        type="submit"
        disabled={isPending}
      >
        {isPending? <LoadingIndicator className="w-[32px] h-[32px]"/> : "Refresh Recipes"}
      </button>
    </form>
  );
}

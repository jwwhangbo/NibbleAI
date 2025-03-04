"use client";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useTransition } from "react";
import LoadingIndicator from "../ui/LoadingIndicator";
import { useRouter } from "next/navigation";
import { removeRecipe } from "@/src/controllers/RecipeController";

export default function DeleteButtonWithDialog({ recipeId }: { recipeId: string }) {
  const [isPending, startTransition] = useTransition();
  const { push } = useRouter();

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="bg-red-500 text-white hover:bg-red-600">
          Delete
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="z-10 fixed inset-0 bg-black bg-opacity-60 data-[state=open]:animate-overlayShow" />
        <AlertDialog.Content className="z-10 fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-100 p-[25px] shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
          <AlertDialog.Title className="m-0 text-[17px] font-bold text-black">
            Are you absolutely sure?
          </AlertDialog.Title>
          <AlertDialog.Description className="mb-5 mt-[15px] text-[15px] leading-normal whitespace-pre-line text-gray-600">
            This action cannot be undone. {"\n"}
            This will permanently delete this recipe.
          </AlertDialog.Description>
          <div className="flex justify-end gap-[25px]">
            <AlertDialog.Cancel asChild>
              <button className="inline-flex h-[35px] items-center justify-center rounded px-[15px] font-bold leading-none text-gray-700 outline-none outline-offset-1 hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-gray-400 select-none">
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action
              asChild
              onClick={(e) => {
                e.preventDefault();
                startTransition(async () => {
                  await removeRecipe(parseInt(recipeId))
                  push("/saved/myrecipe");
                });
              }}
            >
              <button
                disabled={isPending}
                className="inline-flex h-[35px] w-[165px] items-center justify-center rounded bg-red-700 px-[15px] font-bold leading-none text-red-300 outline-none outline-offset-1 disabled:bg-red-900 hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-red-400 select-none"
              >
                {isPending ? (
                  <LoadingIndicator className="w-[20px] h-[20px]" />
                ) : (
                  "Yes, delete recipe"
                )}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

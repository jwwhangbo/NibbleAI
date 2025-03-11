import { removeCollection } from "@/src/controllers/CollectionController";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import LoadingIndicator from "../ui/LoadingIndicator";

export default function CollectionDeleteButtonDialog({
  collectionId,
}: {
  collectionId: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setOpen] = useState<boolean>(false);
  const { refresh } = useRouter();

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        <button className="text-gray-400 hover:text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
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
            This will permanently delete this collection.
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
                  await removeCollection(collectionId);
                  refresh();
                  setOpen(false);
                });
              }}
            >
              <button
                className="inline-flex h-[35px] w-[100px] items-center justify-center rounded bg-red-700 px-[15px] font-bold leading-none text-red-300 outline-none outline-offset-1 disabled:bg-red-900 hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-red-400 select-none"
                disabled={isPending}
              >
                {isPending ? (
                  <LoadingIndicator className="w-[20px] h-[20px]" />
                ) : (
                  "Delete"
                )}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { Comment } from "@/lib/types";
import RatingsHandler from "./ratingsHandler";
import TextareaWithCounter from "../textareaCounter";
import { createContext, SetStateAction, useContext, useState, useTransition } from "react";
import { updateRatingsWithRatingId } from "@/src/controllers/RatingsController";
import { useRouter } from "next/navigation";
import invariant from "tiny-invariant";

const CommentContext = createContext<Comment & { id:number } | undefined>(undefined);

export default function CommentDropdownActions({
  authorized,
  comment,
}: {
  authorized: boolean;
  comment: Comment & { id: number };
}) {
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

  return (
    <CommentContext.Provider value={comment}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 hover:bg-gray-200 rounded-md"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
              />
            </svg>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="left"
            sideOffset={-5}
            className="rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
          >
            {authorized && (
              <DropdownMenu.Item
                className="flex items-center h-[25px] select-none rounded-[3px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100"
                asChild
                onSelect={() => setEditDialogOpen(true)}
              >
                <button>edit rating</button>
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <EditRatingDialog useOpenState={[editDialogOpen, setEditDialogOpen]} />
    </CommentContext.Provider>
  );
}

function EditRatingDialog({ useOpenState }: { useOpenState: [boolean, React.Dispatch<SetStateAction<boolean>>] }) {
  const [open, setOpen] = useOpenState;
  const [isPending, startTransition] = useTransition();
  const { refresh } = useRouter();
  const comment = useContext(CommentContext);
  invariant(
    comment !== undefined,
    "useDraft must be used within a DraftProvider"
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* <Dialog.Trigger>Edit Rating</Dialog.Trigger> */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 data-[state=open]:animate-overlayShow z-10" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-100 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow z-20">
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            Edit Rating
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
            Make changes to your rating here. Click save when you&apos;re done.
          </Dialog.Description>
          <form
            action={(formData) => {
              const formEntries = {
                rating_stars: Number(formData.get("rating_stars")),
                rating_description: formData.get(
                  "rating_description"
                ) as string ?? null,
              };
              startTransition(() => {
                updateRatingsWithRatingId(comment.id, formEntries);
                refresh();
                setOpen(false);
              });
            }}
          >
            <fieldset className="mb-[15px] flex items-center justify-center gap-5">
              <RatingsHandler
                nStars={5}
                size={"lg"}
                value={Math.floor(comment.rating_stars)}
              />
            </fieldset>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <TextareaWithCounter
                name="rating_description"
                defaultValue={comment.rating_description}
                maxLength={500}
                className="w-full"
              />
            </fieldset>
            <div className="mt-[25px] flex justify-end">
              <button
                className="inline-flex h-[35px] items-center justify-center rounded bg-green4 px-[15px] font-medium leading-none text-green11 outline-none outline-offset-1 hover:bg-green5 focus-visible:outline-2 focus-visible:outline-green6 select-none"
                disabled={isPending}
              >
                Save changes
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
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
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

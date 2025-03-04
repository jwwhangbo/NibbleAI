import { addNewCollection } from "@/src/controllers/CollectionController";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip"

export default function AddButton() {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { refresh } = useRouter();
  const formAction = async (formData: FormData) => {
    if (process.env.NODE_ENV === "development") {
      for (const [key, val] of formData.entries()) {
        console.log(key, val);
      }
      console.log(
        `[${
          new Date().toISOString()
        }] creating new collection with name ${formData.get("collectionName")}`
      );
    }
    await addNewCollection(formData.get('collectionName') as string);
    if (process.env.NODE_ENV) {
      console.log(
        `[${
          new Date().toISOString()
        }] successfully created new collection with name ${formData.get("collectionName")}`
      );
    }
    refresh();
    setIsAdding(false);
  };
  if (isAdding) {
    return (
      <form action={formAction}>
        <div className="flex gap-2 sm:block">
          <input
            name="collectionName"
            className="w-full p-1 border-2 border-gray-200 focus:outline-none focus:border-blue-200 focus:ring rounded-md"
            type="text"
            maxLength={100}
            required
          />
          <div className="flex justify-between gap-2 items-center">
            <button>create</button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsAdding(false);
              }}
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
          </div>
        </div>
      </form>
    );
  } else {
    return (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              className="w-full rounded-full border-2 border-gray-200 my-2 hover:bg-gray-300"
              onClick={(e) => {
                e.preventDefault();
                setIsAdding(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 m-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="select-none rounded bg-white px-[15px] py-2.5 text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
              sideOffset={5}
              side='bottom'
            >
              Create new collection
              <Tooltip.Arrow className="fill-white" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }
}

"use client";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import LoadingIndicator from "./LoadingIndicator";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function PreferenceAlertDialog({
  submitted,
  open,
}: {
  submitted: boolean;
  open: boolean;
}) {
  const nextRouter = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(isOpen: boolean) => {
        const handleKeydown = (e: KeyboardEvent) => {
          if (["Space", "Enter"].includes(e.code)) {
            e.preventDefault();
            e.stopPropagation();
          }
        };

        if (isOpen) {
          window.addEventListener("keydown", handleKeydown);
        } else {
          window.removeEventListener("keydown", handleKeydown);
        }
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-60 data-[state=open]:animate-[fadeIn_0.3s]" />
        <AlertDialog.Content
          className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] rounded-md bg-white p-[25px] transform -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-[fadeIn_0.5s]"
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {submitted ? (
            <div className="animate-fadeIn">
              <AlertDialog.Title className="m-0 text-[17px] font-medium text-black text-center">
                Complete
              </AlertDialog.Title>
              <div className="w-full flex justify-center mt-2">
                <AlertDialog.Action asChild>
                  <button
                    type="button"
                    className="px-4 py-2 border-2 border-black rounded disabled:bg-gray-400"
                    onClick={(e) => {
                      startTransition(() => 
                      {e.preventDefault();
                      e.currentTarget.disabled = true;
                      nextRouter.push("/dashboard");})
                    }}
                  >
                    {isPending ? <LoadingIndicator className="w-[24px] h-[24px]"/> :"Continue"} 
                  </button>
                </AlertDialog.Action>
              </div>
            </div>
          ) : (
            <>
              <AlertDialog.Title className="m-0 text-[17px] font-medium text-black text-center">
                Analyzing your preference
              </AlertDialog.Title>
              <LoadingIndicator className="w-[40px] mx-auto my-2" />
              <AlertDialog.Description className="mb-5 mt-[15px] text-[15px] leading-normal text-black"></AlertDialog.Description>
            </>
          )}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

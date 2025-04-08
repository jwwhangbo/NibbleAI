"use client";
import { RegenerateRecipeIds } from "@/src/controllers/RecipeController";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { getUserTokenStatusUpdateOnCall } from "@/src/controllers/AITokensController";

export default function RefreshButton() {
  const [isPending, setIsPending] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | undefined>();
  const { refresh } = useRouter();

  useEffect(() => {
    const fetchPendingStatus = async () => {
      try {
        const response = await fetch("/api/fetching");
        const data = await response.json();
        if (process.env.NODE_ENV === "development") {
          console.log(
            `[${new Date().toISOString()}] generating status: ${data.isFetching}`
          );
        }
        setIsPending(data.isFetching);
      } catch (error) {
        console.error("Failed to fetch pending status:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      }
    };

    fetchPendingStatus();
    const interval = setInterval(fetchPendingStatus, 15000);

    return () => clearInterval(interval);
  }, []);

  const buttonAction = async () => {
    setIsPending(true);
    try {
      const {tokens, } = await getUserTokenStatusUpdateOnCall();
      if (tokens === 0) {
        throw Error('Not enough tokens');
      }
      await RegenerateRecipeIds();
      refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        // console.log(error.message);
        // console.error(error);
        alert(error.message);
      } else {
        setError(String(error));
      }
    }
  };

  return (
    <button
      className="flex justify-center items-center p-2"
      title="refresh"
      type="submit"
      disabled={isPending}
      onClick={buttonAction}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={clsx(["size-6", { "animate-spin": isPending }])}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </button>
  );
}

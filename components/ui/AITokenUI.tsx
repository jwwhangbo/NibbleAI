"use client";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function TokenUI({
  tokensData: { tokens, secondsUntilNextToken },
}: {
  tokensData: { tokens: number; secondsUntilNextToken: number };
}) {
  const [timeLeft, setTimeLeft] = useState(secondsUntilNextToken);
  const { refresh } = useRouter();
  const tokenCounterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      refresh();
    }
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `00:${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <div className="flex gap-2 p-2 bg-orange-200 rounded-lg items-center">
      <p className="font-semibold">Remaining tokens: {tokens}/5</p>
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-[24px] w-[24px] text-gray-600 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content
            className="w-[320px] flex flex-col items-center rounded-md bg-white p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
            sideOffset={5}
          >
            <div>
              <p className="text-sm">
                Using AI services will deduct "tokens" from your account.
                You will be unable to use AI services without tokens
                If you used up your tokens, a new token will be given every hour.
              </p>
            </div>
            <div ref={tokenCounterRef} className="bg-gray-200 p-2 rounded-md w-full">
              <p className="text-center">Time Left Until Next Coin: {formatTime(timeLeft)}</p>
            </div>
            <HoverCard.Arrow className="fill-white" />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </div>
  );
}

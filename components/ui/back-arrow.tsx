'use client';

import { useRouter } from "next/navigation";

export default function BackArrow(props: React.HTMLAttributes<HTMLButtonElement>) {
  const nextrouter = useRouter();
  return (
    <button type="button" onClick={() => nextrouter.back()} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="size-6 w-[35px] h-[35px]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>
    </button>
  );
}
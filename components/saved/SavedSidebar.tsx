'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function SavedSidebar({ collections }: { collections: {id: number; name: string}[] }) {
  const [active, setActive] = useState<boolean>(true)
  const pathname = usePathname();
  const paths = pathname.split('/');
  const currentPage = paths[paths.length - 1];

  function handleClick(): void {
    setActive((state) => !state);
  }

  return (
    <div className="h-[calc(100dvh-2rem-73px)] flex fixed">
      <div className="hidden sm:block h-full bg-white w-[150px] -translate-x-[150px] z-10"></div>
      <div
        className={clsx([
          "fixed h-full flex -translate-x-[148px] transition-transform ease-in-out",
          { "translate-x-0": active },
        ])}
      >
        <div className="w-[150px] my-4 border-r-2 px-1 bg-white">
          <ul className="flex flex-col gap-1 *:text-center">
            <li>
              <Link
                href={"/saved/myrecipe"}
                className={clsx([
                  "block w-full h-full py-2 rounded-md hover:bg-gray-200",
                  {
                    "bg-orange-300 pointer-events-none":
                      currentPage === "myrecipe",
                  },
                ])}
              >
                My Recipes
              </Link>
            </li>
            <li>
              <Link
                href={"/saved/No%20Category"}
                className={clsx([
                  "block w-full h-full py-2 rounded-md hover:bg-gray-200",
                  {
                    "bg-orange-300 pointer-events-none":
                      currentPage === "No%20Category",
                  },
                ])}
              >
                Saved Recipes
              </Link>
            </li>
            {collections.map((collection) => {
              if (collection.name !== "No Category") {
                return (
                  <li key={`c-${collection.id}`}>
                    <Link
                      href={`/saved/${collection.name}`}
                      className={clsx([
                        "block w-full h-full py-2 rounded-md hover:bg-gray-200",
                        {
                          "bg-orange-300 pointer-events-none":
                            decodeURIComponent(currentPage) === collection.name,
                        },
                      ])}
                    >
                      {collection.name}
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </div>
        <button onClick={handleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={clsx(["size-6", { "rotate-180": !active }])}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

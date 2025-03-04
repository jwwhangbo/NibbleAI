'use client';

import clsx from "clsx";
import Link from "next/link";
import { use } from "react";

export default function CollectionList({ collectionPromise, currentPage }: { collectionPromise: Promise<{id: number; name: string}[]>, currentPage: string }) {
  const collections = use(collectionPromise)
  return (
    <>
      {collections.map((collection) => {
        if (collection.name !== "No Category") {
          return (
            <li
              key={`c-${collection.id}`}
              className="flex justify-between items-center"
            >
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
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={(e) => {
                  e.preventDefault();
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
            </li>
          );
        }
      })}
    </>
  );
}

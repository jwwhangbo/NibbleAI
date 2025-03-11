'use client';

import clsx from "clsx";
import Link from "next/link";
import { use } from "react";
import CollectionDeleteButtonDialog from "./CollectionDeletebuttonDialog";

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
              <CollectionDeleteButtonDialog collectionId={collection.id} />
            </li>
          );
        }
      })}
    </>
  );
}

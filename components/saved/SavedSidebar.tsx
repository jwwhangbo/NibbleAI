"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import CollectionList from "@/components/saved/CollectionList";
import LoadingIndicator from "../ui/LoadingIndicator";
import AddButton from "@/components/saved/AddButton";

export default function SavedSidebar({
  collectionPromise,
}: {
  collectionPromise: Promise<{ id: number; name: string }[]>;
}) {
  const pathname = usePathname();
  const paths = pathname.split("/");
  const currentPage = paths[paths.length - 1];

  return (
    <div className="shrink-0 sm:w-[150px] my-2 sm:my-4 border-r-2 px-2 sm:px-1 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
      <ul className="flex flex-row sm:flex-col gap-3 sm:gap-1 *:text-center *:flex-none">
        <li>
          <Link
            href={"/saved/myrecipe"}
            className={clsx([
              "block w-full h-full py-2 px-1 rounded-md hover:bg-gray-200",
              {
                "bg-orange-300 pointer-events-none": currentPage === "myrecipe",
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
              "block w-full h-full py-2 px-1 rounded-md hover:bg-gray-200",
              {
                "bg-orange-300 pointer-events-none":
                  currentPage === "No%20Category",
              },
            ])}
          >
            Saved Recipes
          </Link>
        </li>
        <Suspense
          fallback={
            <li className="w-full my-2">
              <LoadingIndicator className="mx-auto w-[24px] h-[24px]" />
            </li>
          }
        >
          <CollectionList
            collectionPromise={collectionPromise}
            currentPage={currentPage}
          />
        </Suspense>
        <li>
          <AddButton />
        </li>
      </ul>
    </div>
  );
}

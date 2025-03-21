"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({
  totalPages,
  ...props
}: { totalPages: number } & React.HTMLAttributes<HTMLDivElement>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageUrl = (pageNumber: string | number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };
  let pages: number[] = [];

  if (totalPages > 0) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  return (
    <div {...props}>
      {pages.map((page) => (
        <Link
          className={clsx("p-1 w-8 h-8 rounded-full text-center",
            { "hover:bg-orange-100": currentPage != page },
            { "bg-orange-300 font-bold text-white": currentPage == page },
          )}
          key={page}
          href={createPageUrl(page)}
          replace
        >
          {page}
        </Link>
      ))}
    </div>
  );
}

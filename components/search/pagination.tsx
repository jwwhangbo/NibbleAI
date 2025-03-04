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
    pages = Array.from(
      Array(totalPages)
        .keys()
        .map((i) => i + 1)
    );
  }
  return (
    <div {...props}>
      {pages.map((page) => (
        <Link
          className={clsx([
            { "hover:text-blue-500": currentPage != page },
            { "text-red-400": currentPage == page },
          ])}
          key={page}
          href={createPageUrl(page)}
          replace
        >
          <p>{page}</p>
        </Link>
      ))}
    </div>
  );
}

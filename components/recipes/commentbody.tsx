"use client";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export default function CommentBody({
  body,
  maxHeight,
}: {
  body: string;
  maxHeight: string;
}) {
  const [hide, setHide] = useState<boolean>(true);
  const [isOverflow, setIsOverflow] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (containerRef.current && paragraphRef.current) {
      if (
        containerRef.current.clientHeight < paragraphRef.current.clientHeight
      ) {
        setIsOverflow(true);
      } else {
        setIsOverflow(false);
      }
    }
  }, [body, maxHeight]);

  return (
    <div>
      <div ref={containerRef} className={clsx(hide && maxHeight)}>
        <p
          ref={paragraphRef}
          className={clsx(
            isOverflow && hide && maxHeight,
            "whitespace-pre-wrap",
            "truncate",
            "h-fit",
            "leading-none",
            "pb-1",
          )}
        >
          {body}
        </p>
      </div>
      {isOverflow && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setHide((prev) => !prev);
          }}
          className="underline font-semibold text-blue-700"
        >
          {hide ? "show more" : "show less"}
        </button>
      )}
    </div>
  );
}

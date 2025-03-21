"use client";
import { useState } from "react";

export default function RatingsHandler({
  nStars,
  readonly = false,
  value,
  disabled,
  size = "sm",
}: {
  nStars: number;
  readonly?: boolean;
  value?: number;
  disabled?: boolean;
  size: "sm" | "lg";
}) {
  const [rating, setRating] = useState<number | undefined>(value);
  const [hoverValue, setHoverValue] = useState<number | undefined>();

  return (
    <div className="relative flex h-full items-center">
      <input
        name="rating_stars"
        className="absolute sr-only left-1/2 bottom-0"
        required
        type="number"
        value={rating ?? 0}
        onChange={(e) => setRating(Number(e.target.value))}
      />
      {Array.from({ length: nStars }).map((_, index) =>
        readonly || disabled ? (
          <svg
            key={index}
            className={`${size === "sm" && "size-4"} ${
              size === "lg" && "size-6"
            } ${
              index + 1 <= (value ?? 0) ? "text-yellow-300" : "text-gray-300"
            } me-1`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
            onMouseEnter={() => setHoverValue(index + 1)}
            onMouseLeave={() => setHoverValue(undefined)}
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        ) : (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              setRating(index + 1);
            }}
            onMouseEnter={() => setHoverValue(index + 1)}
            onMouseLeave={() => setHoverValue(undefined)}
          >
            <svg
              className={`${size === "sm" && "size-4"} ${
                size === "lg" && "size-6"
              } ${
                index + 1 <= (rating ?? 0) || index + 1 <= (hoverValue ?? 0)
                  ? "text-yellow-300"
                  : "text-gray-300 hover:text-yellow-300"
              } me-1`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
          </button>
        )
      )}
    </div>
  );
}

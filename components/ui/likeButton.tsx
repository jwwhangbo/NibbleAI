"use client";
import {
  addRecipetoNocategory,
  removeLikedRecipe,
} from "@/src/controllers/CollectionController";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

// likeHeart.tsx
const LikeButton = ({
  active,
  recipeId,
  ...props
}: {
  active: boolean;
  recipeId: number;
} & React.HTMLAttributes<HTMLButtonElement>) => {
  const [isactive, setIsactive] = useState<boolean>(active);

  const handleLike = async (recipeId: number) => {
    setIsactive((prev) => !prev);
    await addRecipetoNocategory(recipeId);
  };
  const handleUnlike = async (recipeId: number) => {
    setIsactive((prev) => !prev);
    await removeLikedRecipe(recipeId);
  };

  const handleClick = () => {
    // e.stopPropagation();
    // e.preventDefault();
    if (isactive) {
      handleUnlike(recipeId);
    } else {
      handleLike(recipeId);
    }
  };
  const debouncedHandleClick = useDebouncedCallback(handleClick, 300);

  return (
    <button
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        debouncedHandleClick();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isactive ? "red" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="black"
        className="relative block m-auto size-6 hover:fill-red-200"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
};

export default LikeButton;

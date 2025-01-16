"use client";

import { Recipe } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import UserProfile from "../ui/userProfile";

type Variant = "list" | "portrait";

export default function RecipeCard({
  variant = "portrait",
  recipe,
}: {
  recipe: Recipe & { id: string } & {
    user: {
      id: number;
      name: string;
      email: string;
      image: string;
    };
  };
  variant?: Variant;
}) {
  const r2ap = process.env.NEXT_PUBLIC_R2_AP;
  const isPortraitMode = variant === "portrait";

  return (
    <div
      className={`group flex gap-3 ${
        isPortraitMode ? "flex-col" : "flex-row"
      } overflow-hidden ${
        isPortraitMode && "sm:aspect-[3/4] aspect-[1/1] sm:w-[242px]"
      } `}
    >
      <div
        className={`relative ${
          isPortraitMode ? "w-full aspect-[5/3]" : "h-full aspect-[1/1]"
        }`}
      >
        <Link href={`/recipes?id=${recipe.id.toString()}`}>
          <Image
            src={`${r2ap}/category_default/${recipe.category.categoryA}.jpg`}
            fill
            objectFit="cover"
            alt="recipe thumbnail"
          />
        </Link>
      </div>
      <div className="h-auto gap-1">
        <p className="line-clamp-2">
          <strong>{recipe.title}</strong>
        </p>
        <UserProfile
          user={recipe.user}
          className="w-fit py-2"
          logoSize={"sm"}
        />
        <p className="text-sm text-ellipsis overflow-hidden line-clamp-2 md:line-clamp-none">
          {recipe.description}
        </p>
      </div>
    </div>
  );
}

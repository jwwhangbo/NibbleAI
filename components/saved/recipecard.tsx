"use client";

import { Recipe } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import UserProfile from "../ui/userProfile";
import clsx from "clsx";

type Variant = "list" | "portrait";

export default function RecipeCard({
  variant = "portrait",
  recipe,
}: {
  recipe: Recipe & { id: string } & {
    user?: {
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
      className={clsx(
        `group flex gap-3 min-h-20 ${
          isPortraitMode ? "flex-col w-full" : "flex-row w-full"
        } overflow-hidden`,
        { "sm:aspect-[3/4] aspect-[1/1] sm:w-[242px]": isPortraitMode }
      )}
    >
      <Link href={`/recipes?id=${recipe.id.toString()}`}>
        <div
          className={`relative ${
            isPortraitMode ? "w-full aspect-[5/3]" : "h-full aspect-[1/1]"
          }`}
        >
          <Image
            src={
              recipe.thumbnail ??
              `${r2ap}/category_default/${recipe.category.categoryA}.jpg`
            }
            fill
            alt="recipe thumbnail"
            sizes="(max-width: 768px) 512px"
            style={{ objectFit: "cover", zIndex: -10 }}
          />
        </div>
      </Link>
      <div className={`h-auto gap-1 ${isPortraitMode ? "w-auto": "w-full"}`}>
        <p
          className={
            isPortraitMode ? "line-clamp-2" : "line-clamp-1 overflow-ellipsis"
          }
        >
          <strong>{recipe.title}</strong>
        </p>
        {recipe.user && (
          <UserProfile
            user={recipe.user}
            className="w-fit py-2"
            logoSize={"sm"}
          />
        )}
        <p className="text-sm text-ellipsis overflow-hidden line-clamp-2 md:line-clamp-none">
          {recipe.description}
        </p>
      </div>
    </div>
  );
}

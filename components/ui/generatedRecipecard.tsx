import Image from "next/image";
import Placeholder from "@/public/landscape-placeholder.png";
import LikeButton from "@/components/ui/likeButton";
import Link from "next/link";
import { use } from "react";
import { Recipe } from "@/lib/types";

export default function RecipeCard({ recipeDataPromise, saved }: { recipeDataPromise: Promise<Recipe & {id: number}>; saved:boolean }) {
  const recipeData = use(recipeDataPromise);
  const r2ap = process.env.NEXT_PUBLIC_R2_AP;
  return (
    <div className="group grow overflow-hidden sm:basis-1/4">
      <Link href={`/recipes?id=${recipeData.id}`} className="flex flex-col gap-4 ">
        <div className="relative w-full aspect-[5/3]">
          <Image
            src={
              `${r2ap}/category_default/${recipeData.category.categoryA}.jpg` ||
              Placeholder
            }
            fill
            alt="recipe thumbnail"
          />
          <div className="absolute m-2 bottom-0 right-0 flex flex-col gap-2">
            <LikeButton
              className="p-1 rounded-full bg-white"
              active={saved}
              recipeId={recipeData.id}
            />
          </div>
        </div>
        <div className="h-auto flex-1 flex flex-col gap-3 *:block">
          <p className="uppercase text-sm text-gray-500 font-semibold">
            {recipeData.category.categoryA.replace("_", " ")}
          </p>
          <p className="h-11">
            <strong>{recipeData.title}</strong>
          </p>
          <p className="text-sm text-ellipsis overflow-hidden line-clamp-2 md:line-clamp-none">
            {recipeData.description}
          </p>
        </div>
      </Link>
    </div>
  );
}

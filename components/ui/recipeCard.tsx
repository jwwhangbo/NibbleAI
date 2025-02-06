import Image from "next/image";
import Placeholder from "@/public/landscape-placeholder.png";
import LikeHeart from "./likeHeart";
import Link from "next/link";

export default function RecipeCard(props: {
  id: number;
  title: string;
  category: {categoryA: string, categoryB: string, dietary?: string};
  description: string;
  saved: boolean;
}) {
  const r2ap = process.env.NEXT_PUBLIC_R2_AP;
  return (
    <div className="group grow overflow-hidden sm:basis-1/4">
      <Link href={`/recipes?id=${props.id}`} className="flex flex-col gap-4 ">
        <div className="relative w-full aspect-[5/3]">
          <Image
            src={
              `${r2ap}/category_default/${props.category.categoryA}.jpg` ||
              Placeholder
            }
            fill
            alt="recipe thumbnail"
          />
          <div className="absolute m-2 bottom-0 right-0 flex flex-col gap-2">
            <LikeHeart
              className="p-1 rounded-full bg-white"
              active={props.saved}
              recipeId={props.id}
            />
          </div>
        </div>
        <div className="h-auto flex-1 flex flex-col gap-3 *:block">
          <p className="uppercase text-sm text-gray-500 font-semibold">
            {props.category.categoryA.replace("_", " ")}
          </p>
          <p className="h-11">
            <strong>{props.title}</strong>
          </p>
          <p className="text-sm text-ellipsis overflow-hidden line-clamp-2 md:line-clamp-none">
            {props.description}
          </p>
        </div>
      </Link>
    </div>
  );
}

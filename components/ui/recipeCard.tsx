import Image from "next/image";
import Placeholder from "@/public/landscape-placeholder.png";
import Link from "next/link";
import LikeHeart from "./likeHeart";

export default function RecipeCard(props: {
  id: number;
  title: string;
  description: string;
  saved: boolean;
}) {
  return (
    <div className="group flex flex-col max-w-[162px] min-[380px]:max-w-[170px] lg:max-w-[200px] h-[191px] md:h-[300px] overflow-hidden">
      <div className="relative w-full">
        <Image
          src={Placeholder}
          width={183}
          height={103}
          alt="recipe thumbnail"
          className="w-full flex-none"
        />
          <LikeHeart
            className="transition-opacity ease-in-out duration-200 opacity-0 group-hover:opacity-100 absolute m-2 top-0 right-0 rounded-full w-[50px] h-[50px] bg-red-400"
            active={props.saved}
            recipeId={props.id}
          />
      </div>
      <div className="h-auto flex-1 gap-1">
        <p>
          <strong>{props.title}</strong>
        </p>
        <p className="text-sm text-ellipsis overflow-hidden line-clamp-2 md:line-clamp-none">
          {props.description}
        </p>
      </div>
      <Link href={{ pathname: "/recipes", query: { id: props.id } }}>
        <p className="text-blue-800">Read more...</p>
      </Link>
    </div>
  );
}

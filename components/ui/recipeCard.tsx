import Image from 'next/image'
import Placeholder from "@/public/landscape-placeholder.png"

export default function RecipeCard(props : {title: string, description: string, ingredients: Record<string, string | number>[]}) {
  return (
    <div className="flex flex-col max-w-[162px] min-[380px]:max-w-[170px] lg:max-w-[200px] h-[191px] md:h-[300px] overflow-hidden">
      <Image
        src={Placeholder}
        width={183}
        height={103}
        alt="recipe thumbnail"
        className="w-full flex-none"
      />
      <div className="h-auto flex-1 gap-1">
        <p>
          <strong>{props.title}</strong>
        </p>
        <p className="text-sm text-ellipsis overflow-hidden line-clamp-2 md:line-clamp-none">
          {props.description}
        </p>
      </div>
    </div>
  );
}

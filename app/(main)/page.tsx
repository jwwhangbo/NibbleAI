import Image from "next/image";
import { getHomePageData, getTrendingRecipes } from "@/src/controllers/HomeController";
import { AdComponent } from "@/components/Adsense/Google";
import { getRecipe } from "@/src/controllers/RecipeController";
import { Recipe } from "@/lib/types";
import Link from "next/link";
import clsx from "clsx";
import landscapePlaceholder from "@/public/landscape-placeholder.png"

export default async function Home() {
  const { featured }: { featured: number[] } = (await getHomePageData()) ?? {
    featured: undefined,
  };
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const rows = await getTrendingRecipes(sixMonthsAgo, 4);
  return (
    <div>
      <main className="mt-6">
        <AdComponent
          client={"ca-pub-2511010321424649"}
          slot={"7704565351"}
          format={"auto"}
          responsive={true}
        />
        <h1 className="px-3 sm:px-0 text-3xl font-bold mb-4">
          Featured Recipes
        </h1>
        {/* featured recipe cards */}
        <div className="flex flex-col sm:flex-row w-full px-3 sm:px-0 gap-3 sm:max-h-[850px]">
          {/** first featured recipe card */}
          <FeaturedRecipeCard recipeid={featured[0]} />{" "}
          {/** Side featured cards */}
          <div className="flex flex-col flex-1 gap-2 sm:max-w-[20%]">
            <FeaturedRecipeCard recipeid={featured[1]} size="sm" />
            <FeaturedRecipeCard recipeid={featured[2]} size="sm" />
            <FeaturedRecipeCard recipeid={featured[3]} size="sm" />
          </div>
        </div>
        <AdComponent
          client={"ca-pub-2511010321424649"}
          slot={"2084573014"}
          format={"auto"}
          responsive={true}
        />
        <h1 className="px-3 sm:px-0 text-3xl font-bold mb-4">Trending Now</h1>
        {/* trending cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-max gap-4 px-3 sm:px-6">
          {rows.map((row) => <TrendingRecipeCard recipeid={row.id} key={row.id} />)}
        </div>
      </main>
    </div>
  );
}

async function TrendingRecipeCard({ recipeid }: { recipeid: number }) {
  const recipeData: Recipe = await getRecipe(recipeid);
  console.log(recipeData);
  
  return (
    <div className="flex flex-auto gap-3">
      <div className="relative aspect-square basis-1/3">
        <Image
          src={recipeData.thumbnail || landscapePlaceholder}
          alt="thumbnail"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="basis-2/3 flex flex-col justify-center">
        <p className="uppercase text-sm text-gray-500 font-semibold">
          {recipeData.category.categoryA.replace("_", " ")}
        </p>{" "}
        <h4 className="text-lg font-semibold">{recipeData.title}</h4>
      </div>
    </div>
  );

}

async function FeaturedRecipeCard({ recipeid, size="lg" }: { recipeid: number, size?: "lg" | "sm" }) {
  const recipeData: Recipe = await getRecipe(recipeid);
  return (
    <Link
      href={`/recipes?id=${recipeid}`}
      className={clsx("sm:basis-3/4 space-y-2", {"sm:max-w-[70%]": size === "lg"})}
    >
      <div className="relative w-full aspect-[5/4]">
        <Image
          src={recipeData.thumbnail}
          alt="thumbnail"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="space-y-2 group">
        <p className="uppercase text-sm text-gray-500 font-semibold">
          {recipeData.category.categoryA.replace("_", " ")}
        </p>
        <h3
          className={clsx(
            "font-semibold group-hover:underline decoration-orange-200",
            { "text-3xl": size === "lg" },
            { "text-xl": size === "sm" },
            { "line-clamp-1": size === "sm" }
          )}
        >
          {recipeData.title}
        </h3>
        {size === "lg" && <p>{recipeData.description}</p>}
      </div>
    </Link>
  );
}

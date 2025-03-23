import Image from "next/image";
import {
  getHomePageData,
  getRecentRatings,
  getTrendingRecipes,
} from "@/src/controllers/HomeController";
import { AdComponent } from "@/components/Adsense/Google";
import { getRecipe } from "@/src/controllers/RecipeController";
import { Recipe } from "@/lib/types";
import Link from "next/link";
import clsx from "clsx";
import landscapePlaceholder from "@/public/landscape-placeholder.png";
import { getUserInfo } from "@/src/controllers/UserController";
import UserProfile from "@/components/ui/userProfile";

export default async function Home() {
  const { featured }: { featured: number[] } = (await getHomePageData()) ?? {
    featured: undefined,
  };
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const trendingRecipes = await getTrendingRecipes(sixMonthsAgo, 4);
  const recentRatings = await getRecentRatings(sixMonthsAgo, 3);

  return (
    <div>
      <main className="mb-6">
        <div className="py-2">
          <AdComponent
            client={"ca-pub-2511010321424649"}
            slot={"7704565351"}
            format={"auto"}
            responsive={true}
          />
        </div>
        <section className="relative py-8">
          <div className="block absolute inset-y-0 bg-orange-100 -z-10 w-screen -left-[calc((100vw-100%)/2)]" />
          <div>
            <h1 className="px-3 sm:px-1 text-3xl font-bold mb-4">
              Featured Recipes
            </h1>
            {/* featured recipe cards */}
            <div className="flex flex-col sm:flex-row w-full px-3 sm:px-1 gap-3 sm:max-h-[850px] sm:justify-center">
              {/** first featured recipe card */}
              <FeaturedRecipeCard recipeid={featured[0]} />{" "}
              {/** Side featured cards */}
              <div className="flex flex-col flex-1 gap-2 sm:max-w-[20%]">
                <FeaturedRecipeCard recipeid={featured[1]} size="sm" />
                <FeaturedRecipeCard recipeid={featured[2]} size="sm" />
                <FeaturedRecipeCard recipeid={featured[3]} size="sm" />
              </div>
            </div>
          </div>
        </section>
        <div className="w-full flex items-center justify-center py-2">
          <AdComponent
            client={"ca-pub-2511010321424649"}
            slot={"2084573014"}
            style={{ display: "inline-block", width: "728px", height: "90px" }}
          />
        </div>
        <section className="py-8 mb-16">
          <div>
            <h1 className="px-3 sm:px-1 text-3xl font-bold mb-4">
              Trending Now
            </h1>
            {/* trending cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-max gap-4 px-3 sm:px-6">
              {trendingRecipes.map((row) => (
                <TrendingRecipeCard recipeid={row.id} key={row.id} />
              ))}
            </div>
          </div>
        </section>
        <h2 className="px-3 sm:px-0 text-2xl font-bold my-4">
          See what others are making
        </h2>
        <div className="flex w-full overflow-x-scroll [&::-webkit-scrollbar]:hidden gap-6 px-4">
          {recentRatings.map((rating, index) => (
            <RatingCard rating={rating} key={index} />
          ))}
        </div>
      </main>
    </div>
  );
}

async function RatingCard({
  rating,
}: {
  rating: {
    userid: number;
    recipeid: number;
    rating_description: string;
    final_date: Date;
  };
}) {
  const recipeData: Recipe = await getRecipe(rating.recipeid);
  const userData = await getUserInfo(rating.userid);

  return (
    <div className="bg-gray-100 rounded-sm p-6 basis-1/3 sm:max-w-[33%] min-w-80 min-h-40">
      <div className="flex">
        <div className="space-y-6 w-full">
          <UserProfile
            disabled
            className="flex items-center gap-2 font-bold text-sm"
            user={{ id: rating.userid, ...userData }}
          />
          <span className="sm:text-2xl italic block max-w-full">
            &quot;{rating.rating_description}&quot;
          </span>
        </div>
        <div className="relative w-24 h-24 rounded-sm overflow-clip shrink-0">
          <Image
            src={recipeData.thumbnail}
            alt={"recipe thumbnail"}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
      <Link
        href={`/recipes/${rating.recipeid}`}
        className="underline text-sm text-red-600 font-extrabold block pt-8"
      >
        {recipeData.title}
      </Link>
    </div>
  );
}

async function TrendingRecipeCard({ recipeid }: { recipeid: number }) {
  const recipeData: Recipe = await getRecipe(recipeid);

  return (
    <Link href={`/recipes/${recipeid}`}>
      <div className="flex flex-auto gap-3">
        <div className="relative aspect-square basis-1/3">
          <Image
            src={recipeData.thumbnail || landscapePlaceholder}
            alt="thumbnail"
            fill
            style={{ objectFit: "cover", borderRadius: "0.125rem" }}
          />
        </div>
        <div className="basis-2/3 flex flex-col justify-center">
          <p className="uppercase text-sm text-gray-500 font-semibold">
            {recipeData.category.categoryA.replace("_", " ")}
          </p>{" "}
          <h4 className="text-lg font-semibold">{recipeData.title}</h4>
        </div>
      </div>
    </Link>
  );
}

async function FeaturedRecipeCard({
  recipeid,
  size = "lg",
}: {
  recipeid: number;
  size?: "lg" | "sm";
}) {
  const recipeData: Recipe = await getRecipe(recipeid);
  return (
    <Link
      href={`/recipes/${recipeid}`}
      className={clsx("sm:basis-3/4 space-y-2", {
        "sm:max-w-[70%]": size === "lg",
      })}
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

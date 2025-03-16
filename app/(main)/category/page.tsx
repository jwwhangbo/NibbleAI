import {
  getRecipesByCategory,
  getTotalPagesRecipesFilteredByCategory,
} from "@/src/controllers/RecipeController";
import Image from "next/image";
import Link from "next/link";
import CategorySelectWrapper from "@/components/category/CategorySelectWrapper";
import landscapePlaceholder from "@/public/landscape-placeholder.png";
import { Recipe } from "@/lib/types";
import Pagination from "@/components/search/pagination";
import { Metadata, ResolvingMetadata } from "next";
import { getRecipeRatingAvgAndCount } from "@/src/controllers/RatingsController";
import RatingsHandler from "@/components/recipes/ratingsHandler";

export async function generateMetadata(
  {
    searchParams,
  }: {
    searchParams: Promise<{ catA?: string; catB?: string; dietary?: string }>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { catB } = await searchParams;
  const parentMetaData = (await parent) as Metadata;
  return {
    ...parentMetaData,
    title: `${
      catB
        ? catB.replace("_", " ").charAt(0).toUpperCase() +
          catB.replace("_", " ").slice(1)
        : ""
    } Recipes | NibbleAI`,
    description: "Search by category",
    openGraph: {
      ...parentMetaData.openGraph,
      title: `${
        catB
          ? catB.replace("_", " ").charAt(0).toUpperCase() +
            catB.replace("_", " ").slice(1)
          : ""
      } Recipes | NibbleAI`,
      description: "Search by category",
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    catA?: string;
    catB?: string;
    dietary?: string;
    page?: string;
  }>;
}) {
  const { catA, catB, dietary, page } = await searchParams;
  const recipeIds = page
    ? await getRecipesByCategory(
        { categoryA: catA, categoryB: catB, dietary },
        parseInt(page)
      )
    : await getRecipesByCategory({ categoryA: catA, categoryB: catB, dietary });
  const recipeCount = await getTotalPagesRecipesFilteredByCategory({
    categoryA: catA,
    categoryB: catB,
    dietary,
  });
  // console.log(recipeIds.slice(0, 4));
  return (
    <main className="pt-6 space-y-5">
      <h1 className="text-2xl font-bold ml-2 capitalize">
        Category:{" "}
        {[catA, catB, dietary].filter(Boolean).join(", ").replace("_", " ")}
      </h1>
      <div className="mx-2">
        <CategorySelectWrapper />
      </div>
      <div className="mx-2 grid grid-cols-1 min-[450px]:grid-cols-2 min-[450px]:gap-4 `md:grid-cols-3 lg:grid-cols-4 gap-3">
        {recipeIds.map((recipeData) => (
          <RecipeCard recipeData={recipeData} key={recipeData.id} />
        ))}
      </div>
      <Pagination
        className="flex gap-2 justify-center mt-4"
        totalPages={Math.ceil(recipeCount / 12)}
      />
    </main>
  );
}

async function RecipeCard({
  recipeData,
}: {
  recipeData: Recipe & { id: number };
}) {
  const r2ap = process.env.NEXT_PUBLIC_R2_AP;
  const ratings = await getRecipeRatingAvgAndCount(recipeData.id);

  return (
    <Link href={`/recipes/${recipeData.id}`}>
      <div className="flex flex-col mb-2">
        <div className="relative w-full aspect-[5/4]">
          <Image
            src={
              recipeData.thumbnail ||
              (recipeData.userid === 1 && recipeData.category
                ? `${r2ap}/category_default/${recipeData.category.categoryA}.jpg`
                : landscapePlaceholder)
            }
            alt="thumbnail"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="space-y-2 mt-4">
          <div className="flex gap-2">
            {recipeData.category?.categoryA && (
              <CategoryTag
                body={recipeData.category.categoryA.replace("_", " ")}
              />
            )}
            {recipeData.category?.categoryB && (
              <CategoryTag
                body={recipeData.category.categoryB.replace("_", " ")}
              />
            )}
            {recipeData.category?.dietary && (
              <CategoryTag
                body={recipeData.category.dietary.replace("_", " ")}
              />
            )}
          </div>
          <h3 className="font-bold">{recipeData.title}</h3>
          <div className="flex">
            <RatingsHandler
              nStars={5}
              readonly
              size={"sm"}
              value={Math.floor(ratings.average_rating)}
            />
            <p className="text-sm">({ratings.ratings_count})</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

const CategoryTag = ({ body }: { body: string }) => {
  return (
    <div className="py-1 px-2 w-fit rounded-lg bg-orange-200 text-xs capitalize">
      <p>{body}</p>
    </div>
  );
};

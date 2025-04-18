"use server";
import { auth } from "@/auth";
import UserProfileSkeleton from "@/components/skeletons/UserProfileSkeleton";
import NavbarUserProfile from "@/components/ui/userProfile";
import { Recipe } from "@/lib/types";
import { getRecipe } from "@/src/controllers/RecipeController";
import { getUserInfo } from "@/src/controllers/UserController";
import Image from "next/image";
import { Suspense } from "react";
import DeleteButtonWithDialog from "@/components/recipes/DeleteButtonWithDialog";
import Link from "next/link";
import BackArrow from "@/components/ui/back-arrow";
import type { Metadata, ResolvingMetadata } from "next";
import CommentSection from "@/components/recipes/commentSection";
import { Poppins } from "next/font/google";
import type { Recipe as RecipeSchema, WithContext } from "schema-dts";
import Script from "next/script";
import { getRecipeRatingAvgAndCount } from "@/src/controllers/RatingsController";

type Props = {
  params: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const parentMetaData = await parent;
  if (!id) {
    return parentMetaData as Metadata;
  }
  const recipe: Recipe & { id: string } = await getRecipe(parseInt(id));
  return {
    title: `${recipe.title} | NibbleAI`,
    description: recipe.description,
    openGraph: {
      title: `${recipe.title} | NibbleAI`,
      description: recipe.description,
      images: [recipe.thumbnail, ...(parentMetaData.openGraph?.images || [])],
    },
  };
}

const NavbarUserProfileWrapper = async ({
  userid,
  ...props
}: { userid: number } & React.HTMLAttributes<HTMLDivElement>) => {
  const userInfo = await getUserInfo(userid);
  return <NavbarUserProfile {...props} user={{ id: userid, ...userInfo }} />;
};

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default async function Page(props: {
  params: Promise<{ id: number | undefined }>;
}) {
  const recipeId = (await props.params)?.id;
  if (!recipeId) {
    throw new Error("Could not find recipe");
  }

  const recipe: Recipe & { id: string } = await getRecipe(recipeId);
  if (!recipe || !recipe.public) {
    throw new Error("Could not find recipe");
  }

  const ratingData = await getRecipeRatingAvgAndCount(recipeId);

  const jsonLd: WithContext<RecipeSchema> = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    image: recipe.thumbnail,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingData.average_rating,
      reviewCount: ratingData.ratings_count,
    },
    author: (await getUserInfo(recipe.userid)).name,
    totalTime: recipe.info?.total_time || "",
    recipeYield: recipe.info?.servings || "",
    keywords: `${recipe.category.categoryA}, ${recipe.category.categoryB}, ${recipe.category.dietary}`,
    recipeIngredient: [...recipe.ingredients.map((ingredient) => `${ingredient.quantity} ${ingredient.unit} ${ingredient.ingredient}`)]
  };

  const session = await auth();

  return (
    <main>
      <div className={`px-[17px] flex flex-col space-y-3 ${poppins.className}`}>
        <BackArrow className="w-fit" />
        <div className="flex flex-col sm:flex-row gap-4">
          {recipe.thumbnail && (
            <div className="relative sm:max-w-[60%] w-full grow aspect-[5/4] basis-2/3">
              <Image
                src={recipe.thumbnail}
                alt="recipe thumbnail"
                fill
                quality={100}
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
          <div className="w-full flex flex-col justify-center gap-6 pr-4 pb-6 sm:pb-0 basis-1/3">
            <h1 className="text-4xl font-bold text-[#dc6b2a]">
              {recipe.title}
            </h1>
            <h3>{recipe.description}</h3>
            <Suspense fallback={<UserProfileSkeleton className="w-fit" />}>
              <NavbarUserProfileWrapper
                className="w-fit"
                userid={recipe.userid}
              />
            </Suspense>
            <time className="italic text-gray-400">
              {recipe.date_updated
                ? `Updated on ${recipe.date_updated.toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}`
                : `Created on ${recipe.date_created.toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}`}
            </time>
            {session && session.user.id === recipe.userid && (
              <div className="rounded-md flex *:px-4 *:py-2 border-2 border-gray-300 w-fit overflow-hidden">
                <Link
                  className="hover:bg-orange-100"
                  href={`/edit?id=${recipe.id}`}
                >
                  Edit
                </Link>
                <DeleteButtonWithDialog recipeId={recipe.id} />
              </div>
            )}
          </div>
        </div>
        <div className="pt-8 space-y-3">
          <h2 className="text-3xl font-bold">Recipe Information</h2>
          <p>
            <strong>Prep Time </strong>
            {recipe.info?.total_time || ""} <strong>Yields</strong>{" "}
            {recipe.info?.servings || ""}
          </p>
        </div>
        <div className="py-5 flex flex-col space-y-3">
          <h2 className="text-3xl font-bold">Ingredients</h2>
          <ul className="list-disc list-inside indent-4 space-y-4">
            {recipe.ingredients.map(
              (
                entry: { ingredient: string; quantity: string; unit: string },
                index
              ) => (
                <li key={`${entry.ingredient}-${index}`}>
                  {entry.ingredient} {entry.quantity} {entry.unit}
                </li>
              )
            )}
          </ul>
        </div>
        <h2 className="text-3xl font-bold">Instructions</h2>
        <ol className="list-none list-inside indent-4 space-y-8">
          {recipe.instructions.map((entry, index: number) => (
            <li key={index}>
              <div className="flex flex-col w-full justify-between items-center space-y-8 text-justify">
                <div className="w-full space-x-2">
                  <span className="font-bold">{`Step ${index + 1}.`}</span>
                  <span>{entry.step}</span>
                </div>
                {!!entry.image && (
                  <div className="relative w-full max-w-[800px] aspect-[4/3] grow-1">
                    <Image
                      src={entry.image}
                      alt={"image"}
                      fill
                      quality={100}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
        <CommentSection recipeId={recipeId} />
      </div>
      <Script
        id="json-ld-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}

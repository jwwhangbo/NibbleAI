import { fetchQueriedRecipes } from "@/src/controllers/RecipeController";
import Image from "next/image";
import placeholderImage from "@/public/landscape-placeholder.png";
import UserProfile from "../ui/userProfile";
import { getUserInfo } from "@/src/controllers/UserController";
import { Suspense } from "react";
import UserProfileSkeleton from "../skeletons/UserProfileSkeleton";
import Link from "next/link";
import RatingsHandler from "../recipes/ratingsHandler";
import { CategoryTag } from "../ui/categoryTag";

export default async function RecipesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const searchResults = await fetchQueriedRecipes(query, currentPage);

  return (
    <div className="w-full pt-4 sm:flex sm:flex-col sm:gap-4">
      {searchResults.map(async (row) => {
        const user = await getUserInfo(row.userid);
        const url = `/recipes/${row.id}`;
        return (
          <div
            key={row.id}
            className="relative w-full sm:flex sm:flex-row sm:gap-2"
          >
            <Link
              href={url}
              className="block w-full sm:w-[200px] h-[200px] shrink-0"
            >
              <Image
                src={row.thumbnail || placeholderImage}
                alt="recipe thumbnail"
                width={200}
                height={200}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Link>
            <div className="w-full space-y-2 py-2">
              <div className="flex gap-2">
                {row.category?.categoryA && (
                  <CategoryTag
                    body={row.category.categoryA.replace("_", " ")}
                  />
                )}
                {row.category?.categoryB && (
                  <CategoryTag
                    body={row.category.categoryB.replace("_", " ")}
                  />
                )}
                {row.category?.dietary && (
                  <CategoryTag
                    body={row.category.dietary.replace("_", " ")}
                  />
                )}
              </div>
              <Link href={url} className="font-bold text-lg">
                {row.title}
              </Link>
              <Suspense fallback={<UserProfileSkeleton />}>
                <UserProfile
                  className="w-fit"
                  user={{ ...user, id: row.userid }}
                />
              </Suspense>
              <p>{row.description}</p>
              <div className="flex">
                <RatingsHandler
                  nStars={5}
                  readonly
                  value={Math.floor(row.average_rating)}
                  size={"sm"}
                />
                <p className="text-sm">({row.total_ratings ?? 0})</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

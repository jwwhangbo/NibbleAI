import { fetchQueriedRecipes } from "@/src/controllers/RecipeController";
import Image from "next/image";
import placeholderImage from "@/public/landscape-placeholder.png";
import UserProfile from "../ui/userProfile";
import { getUserInfo } from "@/src/controllers/UserController";
import { Suspense } from "react";
import UserProfileSkeleton from "../skeletons/UserProfileSkeleton";
import Link from "next/link";

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
        const params = new URLSearchParams();
        params.set("id", row.id);
        const url = `/recipes?${params.toString()}`;
        return (
          <div
            key={row.id}
            className="relative w-full sm:flex sm:flex-row sm:gap-2"
          >
            <Link href={url} className="block w-full sm:w-[200px] h-[200px] shrink-0">
              <Image
                src={row.thumbnail ?? placeholderImage}
                alt="recipe thumbnail"
                width={200}
                height={200}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Link>
            <div className="w-full flex flex-col gap-2">
              <p>
                <strong>{row.title}</strong>
              </p>
              <Suspense fallback={<UserProfileSkeleton />}>
                <UserProfile className="w-fit" user={user} />
              </Suspense>
              <p>{row.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

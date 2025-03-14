import { auth } from "@/auth";
import TextareaWithCounter from "../textareaCounter";
import LoadingIndicator from "../ui/LoadingIndicatorBouncing";
import RatingsHandler from "./ratingsHandler";
import { Suspense } from "react";
import Comments from "./comments";
import { addRatingsWithRecipeId, hasUserRatedRecipe } from "@/src/controllers/RatingsController";
import { revalidatePath } from "next/cache";

export default async function CommentSection({ recipeId }: { recipeId: number }) {
  const session = await auth();
  const hasRated = session ? await hasUserRatedRecipe(recipeId) : false;

  const formAction = async (formData: FormData) => {
    "use server";
    const formEntries = {
      rating_stars: Number(formData.get("rating_stars")),
      rating_description: formData.get("rating_description") as string,
    };
    await addRatingsWithRecipeId(recipeId, formEntries);
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[${new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}] Added rating for recipe ${recipeId} with user ${session?.user.id}`
      );
    }
    revalidatePath('/recipes', "page");
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-4xl font-bold mb-10">Comments</h2>
      <form className="h-full" action={formAction}>
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center">
          <RatingsHandler nStars={5} disabled={session === null || hasRated} size="lg"/>
          <div className="hidden md:block h-20 w-[1px] mx-[15px] bg-gray-400" />
          <div className="flex gap-2 items-end grow w-full">
            <TextareaWithCounter
              className="w-full"
              name="rating_description"
              maxLength={500}
              placeholder={
                session
                  ? (hasRated ? "You already rated this recipe": "leave a comment")
                  : "You must be logged in to leave a comment"
              }
              disabled={session === null || hasRated}
            />
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 focus:outline-none disabled:bg-gray-400"
              disabled={session === null || hasRated}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <Suspense
        fallback={
          <LoadingIndicator className="w-fit mx-auto py-4 text-orange-300" />
        }
      >
        <Comments recipeId={recipeId} userid={session?.user.id}/>
      </Suspense>
    </div>
  );
}

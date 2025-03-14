import { getRatingsFromRecipeId } from "@/src/controllers/RatingsController";
import CommentUserProfile from "./commentUserProfileSC";
import RatingsHandler from "./ratingsHandler";
import { formatDistanceToNow } from "date-fns";
import CommentBody from "./commentbody";
import CommentDropdownActions from "./commentDropdownActions";

export default async function Comments({ recipeId, userid }: { recipeId: number, userid: number }) {
  const comments = await getRatingsFromRecipeId(recipeId);
  return (
    <div className="py-6 md:px-6">
      {comments.map((comment, idx) => (
        <div key={`comment-${idx}`}>
          <div className="flex justify-between items-start">
            <CommentUserProfile userid={comment.userid} key={idx} />
            <CommentDropdownActions authorized={comment.userid === userid} />
          </div>
          <div className="flex gap-2 items-center mb-4">
            <RatingsHandler
              readonly
              nStars={5}
              value={comment.rating_stars}
              size="sm"
            />
            <time className="text-sm text-gray-500">
              {formatDistanceToNow(comment.date_created, { addSuffix: true })}
            </time>
          </div>
          {comment.rating_description && (
            <CommentBody
              body={comment.rating_description}
              maxHeight={"max-h-[100px]"}
            />
          )}
          {idx < comments.length - 1 && (
            <div className="h-[1px] bg-gray-400 mx-auto my-4 w-full" />
          )}
        </div>
      ))}
    </div>
  );
}

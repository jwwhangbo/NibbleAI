import { getRecipe } from "@/src/controllers/RecipeController";
import NewRecipeForm from "@/components/recipes/NewRecipeForm";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import {
  addDraftFromRecipeId,
  getDraftFromId,
  getDraftFromRecipeId,
  getUserDrafts,
} from "@/src/controllers/DraftController";
import { DraftProvider } from "@/src/providers/draft-context-provider";
import { redirect } from "next/navigation";

/*
case 0. No recipeId is provided as search parameter (new draft, no recipe)
  case 0-0. create new draft when form is first edited. (Prevent orphaned empty recipes) --- I prefer this over creating a new draft on button click. 
    => maybe bake this in with the save on edit feature?
  case 0-1. User loads from saved draft (Only draft, no recipe)
    => User should be directed with search params draftid
case 1. recipeId is provided as search parameter
  case 1-0. recipeId hits drafts table
    => Let user choose if user wants to continue editing draft
  case 1-1. no hits in drafts table
    => create new draft with recipeid.
*/

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id: string; draftId: string }>;
}) {
  const params = await searchParams;
  const recipeId = params.id;
  let draftId = params.draftId ? parseInt(params.draftId) : undefined;
  const recipeData = recipeId ? await getRecipe(parseInt(recipeId)) : undefined;
  const session = await auth();

  if (recipeData && session?.user.id !== recipeData.userid) {
    throw Error("Unauthorized Access");
  }

  // Fetch draft data if exists
  let recipeDraftData = recipeData
    ? await getDraftFromRecipeId(parseInt(recipeId))
    : draftId
    ? await getDraftFromId(draftId)
    : undefined;

  if (recipeDraftData && session?.user.id !== recipeDraftData.userid) {
    throw Error("Unauthorized Access");
  }

  if (draftId && !recipeDraftData) {
    redirect('/recipes/edit');
  }

  // If no drafts exist for recipe id, create new one.
  if (recipeId && !recipeDraftData) {
    recipeDraftData = await addDraftFromRecipeId(
      parseInt(recipeId),
      recipeData
    );
    draftId = recipeDraftData.id;
  }

  return (
    <div className="px-4 sm:px-[30px] space-y-4">
      <h1 className="font-bold text-2xl py-2">Edit Recipe</h1>
      <SessionProvider session={session}>
        <DraftProvider initialDraftId={draftId}>
          <NewRecipeForm
            recipeDraftData={recipeDraftData}
            userDraftPromise={getUserDrafts(session?.user.id)}
          />
        </DraftProvider>
      </SessionProvider>
    </div>
  );
}

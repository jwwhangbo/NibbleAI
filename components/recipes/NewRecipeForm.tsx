"use client";
import RecipeImageHandler from "@/components/recipes/imageHandler";
import TextareaWithCounter from "@/components/textareaCounter";
import IngredientsHandler from "@/components/recipes/edit/ingredientsHandler";
import InstructionsHandler from "@/components/recipes/edit/InstructionsHandler";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CategorySelect } from "@/components/recipes/edit/categorySelect";
import { RecipeData, RecipeDraft } from "@/lib/types";
import { useSession } from "next-auth/react";
import { use, useEffect, useState, useTransition } from "react";
import {
  addEmptyDraftFromUserId,
  deleteDraft,
  saveDraft,
  uploadDraftToRecipes,
} from "@/src/controllers/DraftController";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDraft } from "@/src/providers/draft-context-provider";
import LoadingIndicator from "../ui/LoadingIndicator";

export default function NewRecipeForm({
  recipeDraftData,
  userDraftPromise,
}: {
  recipeDraftData?: RecipeDraft;
  userDraftPromise: Promise<{ title: string; id: number; last_saved: Date }[]>;
}) {
  const userDrafts = use(userDraftPromise);
  const { draftIdState, setDraftIdState } = useDraft();
  const [lastSaved, setLastSaved] = useState<Date | undefined>(
    recipeDraftData?.last_saved
  );
  const [title, setTitle] = useState(recipeDraftData?.title ?? "");
  const [description, setDescription] = useState(recipeDraftData?.description ?? "");
  const [servings, setServings] = useState(recipeDraftData?.info?.servings ?? "");
  const [cookTime, setCookTime] = useState(recipeDraftData?.info?.total_time ?? "");
  const [isSavePending, startSaveTransition] = useTransition();
  const [isSubmitPending, startSubmitTransition] = useTransition();
  const params = useSearchParams();
  const { replace, push, refresh } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const draftId = params.get("draftid");
    if (draftId) {
      setDraftIdState(parseInt(draftId));
    } else {
      setDraftIdState(undefined);
    }
    refresh();
  }, [params, refresh, setDraftIdState]);

  useEffect(() => {
    setTitle(recipeDraftData?.title ?? "");
    setDescription(recipeDraftData?.description ?? "");
    setServings(recipeDraftData?.info?.servings ?? "");
    setCookTime(recipeDraftData?.info?.total_time ?? "")
  }, [recipeDraftData]);

  /**
   * Handles the save action for the new recipe form.
   *
   * This function performs the following steps:
   * 1. Checks if there is an existing draft ID. If not, it creates a new recipe draft.
   * 2. Logs the creation of a new recipe draft in development mode.
   * 3. Creates a new draft ID by calling `addEmptyDraftFromUserId` with the user's ID.
   * 4. Sets the draft ID state with the newly created draft ID.
   * 5. Retrieves the form data from the document's form element.
   * 6. Processes the form data into a structured format.
   * 7. Saves the draft using the processed form values and the draft ID.
   *
   * @returns {Promise<void | undefined>} A promise that resolves when the draft is saved, or undefined if no draft ID is available.
   */
  const handleSave = async () => {
    if (!draftIdState) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[${new Date().toISOString()}] creating new recipe draft with userid ${
            sessionData?.user.id
          }`
        );
      }
      const draftId = await addEmptyDraftFromUserId(sessionData?.user.id);
      if (!params.get("draftid")) {
        const newParams = new URLSearchParams(params);
        newParams.set("draftid", draftId.id);
        replace(`${pathname}?${newParams.toString()}`);
      }
      setDraftIdState(draftId.id);
      refresh();
    }
    if (draftIdState) {
      const formData = new FormData(
        document.querySelector("form") as HTMLFormElement
      );
      const formValues = processFormData(formData);
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[${new Date().toISOString()}] saving draft with id ${draftIdState}`
        );
      }
      const newLastSaved = new Date(
        await saveDraft(formValues as RecipeDraft, draftIdState)
      );
      setLastSaved(newLastSaved);
    }
  };

  const debouncedSaveDraft = useDebouncedCallback(
    () => startSaveTransition(handleSave),
    500
  );

  const sessionData = useSession().data;

  function processFormData(formData: FormData): RecipeData {
    const result: RecipeData = {
      category: { categoryA: "", categoryB: "" },
      ingredients: [],
      instructions: [],
      info: { total_time: "", servings: "" },
      userid: sessionData?.user.id,
      title: "",
      thumbnail: "",
      description: "",
    };

    formData.forEach((value, key) => {
      switch (true) {
        case key.startsWith("ingredient-"):
          {
            const index = parseInt(key.split("-")[1]);
            result.ingredients[index] = result.ingredients[index] || {
              ingredient: "",
              quantity: "",
              unit: "",
            };
            result.ingredients[index].ingredient = value as string;
          }
          break;
        case key.startsWith("quantity-"):
          {
            const index = parseInt(key.split("-")[1]);
            result.ingredients[index] = result.ingredients[index] || {
              ingredient: "",
              quantity: "",
              unit: "",
            };
            result.ingredients[index].quantity = value as string;
          }
          break;
        case key.startsWith("unit-"):
          {
            const index = parseInt(key.split("-")[1]);
            result.ingredients[index] = result.ingredients[index] || {
              ingredient: "",
              quantity: "",
              unit: "",
            };
            result.ingredients[index].unit = value as string;
          }
          break;
        case key.startsWith("step-"):
          {
            const index = parseInt(key.split("-")[1]);
            result.instructions[index] = result.instructions[index] || {
              step: "",
              image: "",
            };
            result.instructions[index].step = value as string;
          }
          break;
        case key.startsWith("image-"):
          {
            const index = parseInt(key.split("-")[1]);
            result.instructions[index] = result.instructions[index] || {
              step: "",
              image: "",
            };
            result.instructions[index].image = value as string;
          }
          break;
        case key === "categoryA" || key === "categoryB" || key === "dietary":
          result.category[key] = value as string;
          break;
        case key === "total_time" || key === "servings":
          result.info[key] = value as string;
          break;
        default:
          switch (key) {
            case "title":
              result.title = value as string;
              break;
            case "description":
              result.description = value as string;
              break;
            case "thumbnail":
              result.thumbnail = value as string;
              break;
            default:
              break;
          }
      }
    });

    return result;
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const formValues = processFormData(formData);

    if (draftIdState) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[${new Date().toISOString()}] uploading draft to recipes...`
        );
      }
      const recipeId = await uploadDraftToRecipes(
        formValues as RecipeDraft,
        draftIdState
      );
      const params = new URLSearchParams();
      params.set("id", recipeId);
      push(`/recipes?${params.toString()}`);
    }
    // *************************************************************
    // ***************** For debugging purposes ********************
    // *************************************************************

    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
    // console.log(formValues);
  };

  function RecipeActionBar() {
    const DiscardDraftButton = () => {
      const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
      const [animationClass, setAnimationClass] =
        useState<string>("animate-fadeIn");
      if (confirmDelete) {
        return (
          <div className={`flex gap-3 items-center ${animationClass}`}>
            <p className="font-semibold text-red-500 line-clamp-1">
              Are you sure?
            </p>
            <div className="flex gap-2 *:px-2">
              <button
                className="hover:underline text-red-500 font-semibold"
                onClick={async (e) => {
                  e.preventDefault();
                  if (draftIdState) {
                    await deleteDraft(draftIdState);
                    setDraftIdState(undefined);
                    push("/edit");
                  } else {
                  }
                }}
              >
                Yes
              </button>
              <button
                className="hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setAnimationClass("animate-fadeOut");
                  setTimeout(() => {
                    setConfirmDelete(false);
                    setAnimationClass("animate-fadeIn");
                  }, 500);
                }}
              >
                No
              </button>
            </div>
          </div>
        );
      }
      return (
        <button
          type="submit"
          className="block text-red-500 font-semibold hover:underline"
          onClick={(e) => {
            e.preventDefault();
            setConfirmDelete(true);
          }}
        >
          Discard Draft
        </button>
      );
    };

    const LoadDraftButton = () => {
      return (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="underline line-clamp-1"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              Load draft ({userDrafts.length})
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[220px] p-5 rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
              sideOffset={5}
            >
              <ul className="space-y-1">
                {userDrafts.map((draft) => (
                  <li
                    key={draft.id}
                    className="hover:bg-gray-100 p-1 rounded-sm"
                  >
                    <div className="flex justify-between gap-3 items-end">
                      <button
                        className="max-w-60 text-ellipsis line-clamp-1 text-left"
                        onClick={(e) => {
                          e.preventDefault();
                          const searchParams = new URLSearchParams();
                          searchParams.set("draftid", draft.id.toString());
                          replace(`${pathname}?${searchParams.toString()}`);
                        }}
                      >
                        {draft.title || "Untitled Recipe"}
                      </button>
                      <p className="text-sm h-fit">
                        {draft.last_saved.toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                      <button
                        className="text-gray-300 hover:text-gray-400"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteDraft(draft.id);
                          refresh();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      );
    };

    return (
      <div className="flex justify-between items-center sticky bottom-0 bg-white py-4">
        <p className="line-clamp-1">
          {isSavePending
            ? "Saving..."
            : `Last Saved: ${
                lastSaved
                  ? new Date(lastSaved).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : ""
              }`}
        </p>
        <div className="flex gap-4 *:rounded-md">
          <LoadDraftButton />
          <DiscardDraftButton />
          <button
            type="submit"
            className="block text-orange-500 font-semibold hover:underline underline-offset-2"
            disabled={isSavePending}
            onClick={(e) => {
              e.preventDefault();
              debouncedSaveDraft();
            }}
          >
            Save
          </button>
          <button
            type="submit"
            className="h-10 w-20 block bg-orange-500 text-white font-semibold hover:bg-orange-600 sm:px-2 sm:py-2 disabled:bg-gray-300"
            disabled={isSubmitPending}
          >
            {isSubmitPending ? <LoadingIndicator className="w-[24px] h-[24px] mx-auto"/> :"Submit"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {startSubmitTransition(() => onSubmit(e))}}
      onChange={(e) => {
        e.preventDefault();
        if (process.env.NODE_ENV === "development") {
          console.log(e);
        }
        debouncedSaveDraft();
      }}
    >
      <p className="text-lg font-semibold">Cover Image</p>
      <RecipeImageHandler
        name="thumbnail"
        className="h-[20rem]"
        image={recipeDraftData?.thumbnail ?? ""}
      />
      <label htmlFor="title" className="text-lg font-semibold">
        Title
      </label>
      <input
        id="title"
        name="title"
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => {setTitle(e.target.value)}}
        maxLength={100}
        className="block w-full px-4 py-2 rounded-md border-2 focus:outline-none focus:ring focus:border-blue-500"
      />
      <label htmlFor="description" className="text-lg font-semibold">
        Description
      </label>
      <TextareaWithCounter
        className="w-full"
        id="description"
        name="description"
        maxLength={255}
        value={description}
        onChange={(e) => {setDescription(e.target.value)}}
        placeholder="a short description about your recipe (max. 255)"
      />
      <p className="text-lg font-semibold">Category</p>
      <CategorySelect initialValues={recipeDraftData?.category}/>
      <span className="text-lg font-semibold">Recipe Information</span>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="flex gap-2 items-center">
          <input
            id="servings"
            name="servings"
            type="text"
            maxLength={100}
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            className="px-4 py-2 w-16 rounded-md border-2 focus:outline-none focus:ring focus:border-blue-500"
          />
          <label htmlFor="servings">Servings</label>
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="total_time">Cook time</label>
          <input
            id="total_time"
            name="total_time"
            type="text"
            maxLength={100}
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            className="px-4 py-2 rounded-md border-2 focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
      </div>
      <span className="text-lg font-semibold">Ingredients</span>
      <IngredientsHandler
        ingredientProps={recipeDraftData?.ingredients}
        debouncedSaveDraft={debouncedSaveDraft}
      />
      <span className="text-lg font-semibold">Steps / Instructions</span>
      <InstructionsHandler instructionProps={recipeDraftData?.instructions} />
      <RecipeActionBar />
    </form>
  );
}

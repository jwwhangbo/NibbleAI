"use client";
import RecipeImageHandler from "@/components/recipes/imageHandler";
import TextareaWithCounter from "@/components/textareaCounter";
import IngredientsHandler from "@/components/recipes/edit/ingredientsHandler";
import InstructionsHandler from "@/components/recipes/edit/InstructionsHandler";
import { CategorySelect } from "@/components/recipes/edit/categorySelect";
import { RecipeData, RecipeDraft } from "@/lib/types";
import { useSession } from "next-auth/react";
import { use, useEffect, useRef, useState, useTransition } from "react";
import {
  addEmptyDraftFromUserId,
  saveDraft,
  uploadDraftToRecipes,
} from "@/src/controllers/DraftController";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDraft } from "@/src/providers/draft-context-provider";

export default function NewRecipeForm({
  recipeDraftData,
  userDraftPromise,
}: {
  recipeDraftData?: RecipeDraft;
  userDraftPromise: Promise<{ title: string; id: number }[]>;
}) {
  const userDrafts = use(userDraftPromise);
  const { draftIdState, setDraftIdState } = useDraft();
  const [lastSaved, setLastSaved] = useState<Date | undefined>(
    recipeDraftData?.last_saved
  );
  const [isPending, startTransition] = useTransition();
  const params = useSearchParams();
  const { replace, push } = useRouter();
  const pathname = usePathname();
  const initialFormValuesRef = useRef<FormData | null>(null);

  useEffect(() => {
    const formElement = document.querySelector("form") as HTMLFormElement;
    if (formElement) {
      initialFormValuesRef.current = new FormData(formElement);
    }
  }, []);

  const hasFormChanged = (currentFormData: FormData) => {
    if (!initialFormValuesRef.current) return false;

    for (const [key, value] of currentFormData.entries()) {
      if (initialFormValuesRef.current.get(key) !== value) {
        return true;
      }
    }
    return false;
  };
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
      if (!params.get("draftId")) {
        const newParams = new URLSearchParams(params);
        newParams.set("draftId", draftId.id);
        replace(`${pathname}?${newParams.toString()}`);
      }
      setDraftIdState(draftId.id);
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
    () => startTransition(handleSave),
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
      const recipeId = await uploadDraftToRecipes(formValues as RecipeDraft, draftIdState);
      const params = new URLSearchParams();
      params.set('id', recipeId);
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
    return (
      <div className="flex justify-between items-center sticky bottom-0 bg-white py-4">
        <p>
          {isPending
            ? "Saving..."
            : `Last Saved: ${
                lastSaved
                  ? new Date(lastSaved)
                      .toISOString()
                      .replace("T", " ")
                      .substring(0, 19)
                  : ""
              }`}
        </p>
        <div className="flex gap-4 *:px-4 *:py-2 *:rounded-md">
          <button className="underline">
            Load draft ({userDrafts.length})
          </button>
          <button
            type="submit"
            className="block text-red-500 border-2 border-red-500 font-semibold hover:bg-red-500 hover:text-white"
          >
            Delete
          </button>
          <button
            type="submit"
            className="block text-orange-500 font-semibold hover:underline underline-offset-2"
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              debouncedSaveDraft();
            }}
          >
            Save
          </button>
          <button
            type="submit"
            className="block bg-orange-500 text-white font-semibold hover:bg-orange-600"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={onSubmit}
      onChange={(e) => {
        console.log(e);
        const formElement = e.currentTarget as HTMLFormElement;
        const currentFormData = new FormData(formElement);
        if (hasFormChanged(currentFormData)) {
          debouncedSaveDraft();
        }
      }}
    >
      <p className="text-lg font-semibold">Cover Image</p>
      <RecipeImageHandler
        name="thumbnail"
        className="h-[20rem]"
        image={recipeDraftData?.thumbnail}
      />
      <label htmlFor="title" className="text-lg font-semibold">
        Title
      </label>
      <input
        id="title"
        name="title"
        type="text"
        placeholder="title"
        defaultValue={recipeDraftData?.title}
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
        defaultValue={recipeDraftData?.description}
        placeholder="a short description about your recipe (max. 255)"
      />
      <p className="text-lg font-semibold">Category</p>
      <CategorySelect initialValues={recipeDraftData?.category} />
      <span className="text-lg font-semibold">Recipe Information</span>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="flex gap-2 items-center">
          <input
            id="servings"
            name="servings"
            type="text"
            maxLength={100}
            defaultValue={recipeDraftData?.info?.servings}
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
            defaultValue={recipeDraftData?.info?.total_time}
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

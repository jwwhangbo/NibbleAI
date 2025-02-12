"use client";
import RecipeImageHandler from "@/components/recipes/imageHandler";
import TextareaWithCounter from "@/components/textareaCounter";
import IngredientsHandler from "@/components/recipes/add/ingredientsHandler"
import InstructionsHandler from "@/components/recipes/add/InstructionsHandler";
import { CategorySelect } from "@/components/recipes/add/categorySelect";
import { Upload } from "@/lib/R2Handler";
import { addRecipe, updateRecipe } from "@/src/controllers/RecipeController";
import { useSession } from "next-auth/react";
import { Recipe } from "@/lib/types";

export default function Page() {
  const sessionData = useSession().data;
  async function uploadFiles(formData: FormData, recipeId: number) {
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const url = await Upload(value, `recipe-${recipeId}/${key}` );
        formData.set(key, url);
      }
    }
  }

  function processFormData(formData: FormData) : Record<string, unknown> {
    const result: {
      category: { [key: string]: FormDataEntryValue },
      ingredients: { ingredient?: FormDataEntryValue, quantity?: FormDataEntryValue, unit?: FormDataEntryValue }[],
      instructions: { step?: FormDataEntryValue, image?: FormDataEntryValue }[],
      info: { [key: string]: FormDataEntryValue },
      public: boolean,
      [key: string]: unknown,
    } = {
      category: {},
      ingredients: [],
      instructions: [],
      info: {},
      public: true
    };

    formData.forEach((value, key) => {

      if (key.startsWith("ingredient-")) {
        const index = parseInt(key.split("-")[1]);
        result.ingredients[index] = result.ingredients[index] || {};
        result.ingredients[index].ingredient = value;
      } else if (key.startsWith("quantity-")) {
        const index = parseInt(key.split("-")[1]);
        result.ingredients[index] = result.ingredients[index] || {};
        result.ingredients[index].quantity = value;
      } else if (key.startsWith("units-")) {
        const index = parseInt(key.split("-")[1]);
        result.ingredients[index] = result.ingredients[index] || {};
        result.ingredients[index].unit = value;
      } else if (key.startsWith("step-")) {
        const index = parseInt(key.split("-")[1]);
        result.instructions[index] = result.instructions[index] || {};
        result.instructions[index].step = value;
      } else if (key.startsWith("image-")) {
        const index = parseInt(key.split("-")[1]);
        result.instructions[index] = result.instructions[index] || {};
        result.instructions[index].image = value;
      } else if (key === "catA" || key === "catB" || key === "dietary") {
        result.category[key] = value;
      } else if (key === "total_time" || key === "servings") {
        result.info[key] = value;
      }else {
        result[key] = value;
      }
    });

    // Filter out undefined entries from ingredients and steps
    result.ingredients = result.ingredients.filter(
      (item) => item && item.ingredient
    );
    result.instructions = result.instructions.filter((item) => item && item.step);

    return result;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const recipeId = await addRecipe({
      userid: sessionData?.user.id, // Replace with actual user ID
      title: "",
      description: "",
      category: {
        categoryA: "",
        categoryB: "",
        dietary: "",
      },
      ingredients: [{
        ingredient: "",
        quantity: 0,
        unit: ""
      }],
      instructions: [{
        step: "",
        image: ""
      }],
      info: {total_time: "", servings: ""},
      thumbnail: "",
      date_created: new Date(),
      public: true // or false, depending on your requirement
    });
    console.log(`[${Date.now()}] created new recipe at ${recipeId}`)
    const id = Array.isArray(recipeId) ? recipeId[0] : recipeId;
    console.log(`[${Date.now()}] uploading files...`);
    await uploadFiles(formData, id);
    console.log(`[${Date.now()}] completed uploading files`);
    const result = processFormData(formData) as Recipe;
    await updateRecipe(id, result);
    console.log(`[${Date.now()}] uploaded recipe!`);
  };

  return (
    <div className="px-4 sm:px-[30px]">
      <h1 className="font-bold text-2xl py-2">Add a new recipe</h1>
      <form onSubmit={onSubmit}>
        <p className="text-lg font-semibold">Cover Image</p>
        <RecipeImageHandler name="thumbnail" className="h-[20rem]" />
        <label htmlFor="title" className="text-lg font-semibold">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="title"
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
          placeholder="a short description about your recipe (max. 255)"
        />
        <label htmlFor="catA" className="text-lg font-semibold">
          Category
        </label>
        <CategorySelect />
        <span className="text-lg font-semibold">Recipe Information</span>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex gap-2 items-center">
            <input
              name="servings"
              type="text"
              maxLength={100}
              className="px-4 py-2 w-16 rounded-md border-2 focus:outline-none focus:ring focus:border-blue-500"
            />
            <label>Servings</label>
          </div>
          <div className="flex gap-2 items-center">
            <label>Cook time</label>
            <input
              name="total_time"
              type="text"
              maxLength={100}
              className="px-4 py-2 rounded-md border-2 focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
        </div>
        <span className="text-lg font-semibold">Ingredients</span>
        <IngredientsHandler />
        <span className="text-lg font-semibold">Steps / Instructions</span>
        <InstructionsHandler />
        <button type="submit" className="block">
          Submit
        </button>
      </form>
    </div>
  );
}

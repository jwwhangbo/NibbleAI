"use client";
import RecipeImageHandler from "@/components/recipes/imageHandler";
import TextareaWithCounter from "@/components/textareaCounter";
import IngredientsHandler from "@/components/recipes/add/ingredientsHandler"
import InstructionsHandler from "@/components/recipes/add/InstructionsHandler";

export default function Page() {
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    // const files = formData.getAll("images");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
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

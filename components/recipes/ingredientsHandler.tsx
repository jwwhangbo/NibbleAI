"use client";
import { useState } from "react";
import IngredientForm from "./add/ingredientForm";

export type TIngredient = {
  id: number;
  ingredient: string;
  quantity: string;
  units: string;
};

export default function IngredientsHandler() {
  const [ingredients, setIngredients] = useState<TIngredient[]>(
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      ingredient: "",
      quantity: "",
      units: "",
    }))
  );
  const createNewIngredientEntry = (() => {
    let maxIdx = 3;

    return function createNewIngredientEntry(): TIngredient {
      return { id: maxIdx++, ingredient: "", quantity: "", units: "" };
    };
  })();

  return (
    <div className="flex flex-col">
      <div className="w-full max-h-[300px] overflow-y-scroll p-1">
        {ingredients.map((ingredient, index) => (
          <IngredientForm
            key={index}
            ingredientprops={ingredient}
            setIngredient={(callback) =>
              setIngredients((prev) =>
                prev.map((ing) =>
                  ing.id === ingredient.id ? callback(ing) : ing
                )
              )
            }
            deleteIngredient={(id) => {
              // FIXME: if length of ingredients is <= 1, throw error -> catch error in error boundary
              setIngredients((prev) => prev.filter((ing) => ing.id !== id));
            }}
          />
        ))}
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          setIngredients((prevState) => [
            ...prevState,
            createNewIngredientEntry(),
          ]);
        }}
        className="border-2 w-fit rounded-full border-black p-1 m-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div>
  );
}

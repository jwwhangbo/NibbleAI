import React, { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import DragHandleButton from "@/components/ui/dragHandleButton";
import { type TIngredient } from "../ingredientsHandler";

export default function IngredientForm({ ingredientprops, setIngredient, deleteIngredient }: { ingredientprops: TIngredient, setIngredient: (callback: (t: TIngredient) => TIngredient) => void, deleteIngredient: (id: number) => void }) {
  const ref = useRef(null);
  const dragHandleRef = useRef(null);
  const { id, ingredient, quantity, units } = ingredientprops;

  useEffect(() => {
    const el = ref.current;
    const dragHandleEl = dragHandleRef.current;
    invariant(el);
    invariant(dragHandleEl);

    return draggable({ element: el, dragHandle: dragHandleEl });
  }, []);

  return (
    <div ref={ref} className="flex gap-2 mb-2 w-full items-center">
      <div ref={dragHandleRef}>
        <DragHandleButton />
      </div>
      <input
        type="text"
        placeholder="Ingredient"
        value={ingredient}
        onChange={(e) => {
          e.preventDefault();
          setIngredient((prev) => ({ ...prev, ingredient: e.target.value }));
        }}
        name={`ingredient-${id}`}
        className="px-4 py-2 flex-auto rounded-md min-w-0 border-2 focus:outline-none focus:ring focus:border-blue-500"
      />
      <input
        type="text"
        placeholder="Quantity"
        value={quantity}
        name={`quantity-${id}`}
        className="px-4 py-2 rounded-md flex-initial min-w-0 border-2 focus:outline-none focus:ring focus:border-blue-500"
        onChange={(e) => {
          e.preventDefault();
          setIngredient((prev) => ({ ...prev, quantity: e.target.value }));
        }}
      />
      <input
        type="text"
        placeholder="Unit"
        value={units}
        name={`units-${id}`}
        className="px-4 py-2 flex-auto rounded-md border-2 min-w-0 focus:outline-none focus:ring focus:border-blue-500"
        onChange={(e) => {
          e.preventDefault();
          setIngredient((prev) => ({ ...prev, units: e.target.value }));
        }}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          deleteIngredient(id);
        }}
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
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

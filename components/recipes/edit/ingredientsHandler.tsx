"use client";
import { useEffect, useRef, useState } from "react";
import IngredientForm, { type TIngredient } from "./ingredientForm";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import { DebouncedState } from "use-debounce";

const ingredientKey = Symbol("ingredientKey");

type IngredientData = {
  [ingredientKey]: true;
  ingredient: TIngredient;
  index: number;
  instanceid: symbol;
};

/**
 * Returns an IngredientData object.
 * @param ingredient - The ingredient object.
 * @param index - The index of the ingredient.
 * @param instanceid - The instance ID symbol.
 * @returns The IngredientData object.
 */
export function GetIngredientData({
  ingredient,
  index,
  instanceid,
}: {
  ingredient: TIngredient;
  index: number;
  instanceid: symbol;
}): IngredientData {
  return {
    [ingredientKey]: true,
    ingredient,
    index,
    instanceid,
  };
}

/**
 * Checks if the given data is of type IngredientData.
 * @param data - The data to check.
 * @returns True if the data is IngredientData, false otherwise.
 */
export function isIngredientData(
  data: Record<string | symbol, unknown>
): data is IngredientData {
  return data[ingredientKey] == true;
}

export default function IngredientsHandler({
  ingredientProps,
  debouncedSaveDraft,
}: {
  ingredientProps?: { ingredient: string; quantity: string; unit: string }[];
  debouncedSaveDraft: DebouncedState<() => Promise<void>>;
}) {
  const [maxId, setMaxId] = useState(
    ingredientProps ? ingredientProps.length : 3
  );
  const [error, setError] = useState<string | null>(null);
  const [instanceId] = useState<symbol>(() => Symbol("instance-id"));
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);
  const [ingredients, setIngredients] = useState<TIngredient[]>(
    ingredientProps
      ? ingredientProps.map((prop, index) => ({ ...prop, id: index }))
      : Array.from({ length: 3 }, (_, i) => ({
          id: i,
          ingredient: "",
          quantity: "",
          unit: "",
        }))
  );

  useEffect(() => {
      setIngredients(
        ingredientProps
          ? ingredientProps.map((prop, index) => ({ ...prop, id: index }))
          : Array.from({ length: 3 }, (_, i) => ({
              id: i,
              ingredient: "",
              quantity: "",
              unit: "",
            }))
      );
    }, [ingredientProps]);

  /**
   * Creates a new ingredient entry.
   * @returns The new ingredient entry.
   */
  const createNewIngredientEntry = () => {
    setMaxId((prevMaxId) => prevMaxId + 1);
    return { id: maxId, ingredient: "", quantity: "", unit: "" };
  };

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return (
          isIngredientData(source.data) && source.data.instanceid === instanceId
        );
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        const sourceData = source.data;
        const targetData = target.data as IngredientData;
        if (!isIngredientData(sourceData) || !isIngredientData(sourceData)) {
          return;
        }
        const indexOfTarget = ingredients.findIndex(
          (ingredient: TIngredient) =>
            ingredient.id === targetData.ingredient.id
        );
        if (indexOfTarget < 0) {
          return;
        }
        const closestEdgeOfTarget = extractClosestEdge(targetData);

        setIngredients((prevState) =>
          reorderWithEdge({
            list: prevState,
            startIndex: sourceData.index,
            indexOfTarget,
            closestEdgeOfTarget,
            axis: "vertical",
          })
        );
        debouncedSaveDraft();
      },
    });
  }, [debouncedSaveDraft, ingredients, instanceId]);

  // handles auto scrolling when adding new ingredients
  useEffect(() => {
    if (isMounted.current) {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }
    } else {
      isMounted.current = true;
    }
  }, [maxId]);

  return (
    <div className="flex flex-col">
      {error && <p className="text-red-500 after:content-['*']">{error}</p>}
      <div className="w-full max-h-[300px] overflow-y-scroll p-1">
        {ingredients.map((ingredient, index) => (
          <IngredientForm
            key={index}
            ingredientprops={ingredient}
            index={index}
            instanceid={instanceId}
            setIngredient={(callback) =>
              setIngredients((prev) =>
                prev.map((ing) =>
                  ing.id === ingredient.id ? callback(ing) : ing
                )
              )
            }
            deleteIngredient={(id) => {
              // FIXME: if length of ingredients is <= 1, throw error -> catch error in error boundary
              setIngredients((prev) => {
                try {
                  const filtered = prev.filter((ing) => ing.id !== id);
                  if (filtered.length < 1) {
                    throw Error("There has to be at least 1 ingredient");
                  }
                  return filtered;
                } catch (err) {
                  setError((err as Error).message);
                  return prev; // Return the previous state if an error occurs
                }
              });
            }}
          />
        ))}
        <div ref={bottomRef} className="w-full h-1"></div>
      </div>
      <button
        onClick={(e) => {
          setError(null);
          e.preventDefault();
          setIngredients((prevState) => [
            ...prevState,
            createNewIngredientEntry(),
          ]);
        }}
        className="border-2 w-fit rounded-full border-black p-1 m-auto hover:bg-gray-200"
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

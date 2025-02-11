"use client";
import { useEffect, useRef, useState } from "react";
import IngredientForm, { type TIngredient } from "./add/ingredientForm";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";

const ingredientKey = Symbol("ingredientKey");

type IngredientData = {
    [ingredientKey] : true,
    ingredient: TIngredient,
    index: number,
    instanceid: symbol
  }

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

export function isIngredientData(data: Record<string | symbol, unknown>): data is IngredientData {
  return data[ingredientKey] == true;
}

export default function IngredientsHandler() {
  const [maxId, setMaxId] = useState(3);
  const [instanceId] = useState<symbol>(() => Symbol("instance-id"));
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [ingredients, setIngredients] = useState<TIngredient[]>(
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      ingredient: "",
      quantity: "",
      units: "",
    }))
  );
  const createNewIngredientEntry = (() => {
    setMaxId((prevMaxId) => prevMaxId + 1);
    return { id: maxId, ingredient: "", quantity: "", units: "" };
  });
  
  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isIngredientData(source.data) && source.data.instanceid === instanceId;
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
          (ingredient: TIngredient) => ingredient.id === targetData.ingredient.id
        );
        if (indexOfTarget < 0) {
          return;
        }
        const closestEdgeOfTarget = extractClosestEdge(targetData);

        setIngredients((prevState) => reorderWithEdge({
          list: prevState,
          startIndex: sourceData.index,
          indexOfTarget,
          closestEdgeOfTarget,
          axis: "vertical",
        }));
      }
    })
  }, [ingredients, instanceId])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({behavior:"smooth", block:"end"})
    }
  },[maxId]);

  return (
    <div className="flex flex-col">
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
              setIngredients((prev) => prev.filter((ing) => ing.id !== id));
            }}
          />
        ))}
        <div ref={bottomRef} className="w-full h-1"></div>
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

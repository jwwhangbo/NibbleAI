import { useEffect, useMemo, useRef, useState } from "react";
import invariant from "tiny-invariant";
import DragHandleButton from "@/components/ui/dragHandleButton";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { GetIngredientData, isIngredientData } from "./ingredientsHandler";
import DragIndicator from "@/components/ui/dragIndicator";

export type TIngredient = {
  id: number;
  ingredient: string;
  quantity: string;
  units: string;
};

export default function IngredientForm({
  ingredientprops,
  index,
  instanceid,
  setIngredient,
  deleteIngredient,
}: {
  ingredientprops: TIngredient;
  index: number;
  instanceid: symbol;
  setIngredient: (callback: (t: TIngredient) => TIngredient) => void;
  deleteIngredient: (id: number) => void;
}) {
  const { id, ingredient, quantity, units } = ingredientprops;
  type DragState =
    | { type: "idle" }
    | { type: "preview"; container: HTMLElement }
    | { type: "dragging" };
  const idleState: DragState = useMemo(() => ({ type: "idle" }), []);
  const draggingState: DragState = useMemo(() => ({ type: "dragging" }), []);
  const ref = useRef(null);
  const dragHandleRef = useRef(null);
  const [dragState, setDragState] = useState<DragState>(idleState);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = ref.current;
    const dragHandleEl = dragHandleRef.current;
    invariant(el);
    invariant(dragHandleEl);
    const data = GetIngredientData({
      ingredient: ingredientprops,
      index,
      instanceid,
    });

    return combine(
      draggable({
        element: el,
        getInitialData: () => data,
        dragHandle: dragHandleEl,
        onDragStart() {
          setDragState(draggingState);
        },
        onDrop() {
          setDragState(idleState);
        },
      }),
      dropTargetForElements({
        element: el,
        canDrop({ source }) {
          return (
            isIngredientData(source.data) &&
            source.data.instanceid == instanceid
          );
        },
        getData({ input }) {
          return attachClosestEdge(data, {
            element: el,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDrag({ self, source }) {
          const isSource = source.element === el;
          if (isSource) {
            setClosestEdge(null);
            return;
          }

          const closestEdge = extractClosestEdge(self.data);

          const sourceIndex = source.data.index;
          invariant(typeof sourceIndex === "number");

          const isItemBeforeSource = index === sourceIndex - 1;
          const isItemAfterSource = index === sourceIndex + 1;

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === "bottom") ||
            (isItemAfterSource && closestEdge === "top");

          if (isDropIndicatorHidden) {
            setClosestEdge(null);
            return;
          }

          setClosestEdge(closestEdge);
        },
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop() {
          setClosestEdge(null);
        },
      })
    );
  }, [ingredientprops, index, instanceid, draggingState, idleState]);

  return (
    <div ref={ref} className="flex gap-2 mb-2 w-full items-center relative">
      <DragHandleButton ref={dragHandleRef} />
      {closestEdge && <DragIndicator edge={closestEdge} gap="-0.5em"/>}
      <input
        type="text"
        placeholder="Ingredient"
        value={ingredient}
        onChange={(e) => {
          e.preventDefault();
          setIngredient((prev) => ({ ...prev, ingredient: e.target.value }));
        }}
        name={`ingredient-${index}`}
        className="px-4 py-2 flex-auto rounded-md min-w-0 border-2 focus:outline-none focus:ring focus:border-blue-500"
      />
      <input
        type="text"
        placeholder="Quantity"
        value={quantity}
        name={`quantity-${index}`}
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
        name={`units-${index}`}
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
          stroke={"currentColor"}
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

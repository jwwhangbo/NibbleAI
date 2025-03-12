import TextareaWithCounter from "@/components/textareaCounter";
import RecipeImageHandler from "../imageHandler";
import { Dispatch, SetStateAction } from "react";

export type TInstruction = {
  id: number;
  image: string;
  step: string;
};

export default function InstructionForm({
  instructionProps,
  setInstructions,
  index,
  deleteInstruction,
}: {
  instructionProps: TInstruction;
  setInstructions: Dispatch<SetStateAction<TInstruction[]>>;
  deleteInstruction: (id: number) => void;
  index: number;
}) {
  const { id, image, step } = instructionProps;

  /**
   * Updates the image URL of a specific instruction in the instructions list.
   *
   * @param {string} newImage - The new image URL to be set for the instruction.
   * @returns {void} - This function does not return a value.
   */
  const setImage = (newImage: string) => {
    setInstructions((prev) =>
      prev.map((inst) => {
        return inst.id === id ? { ...inst, image: newImage } : inst;
      })
    );
  };

  const setStep = (newStep: string) => {
    return setInstructions((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, step: newStep } : inst))
    );
  };

  return (
    <div className="flex w-full gap-4 items-center">
        <p className="font-semibold line-clamp-1 shrink-0">Step {index+1}.</p>
      <div className="flex gap-2 grow w-full">
        <TextareaWithCounter
          className="w-full grow basis-2/3"
          id={`step-${index}`}
          name={`step-${index}`}
          maxLength={500}
          value={step}
          onChange={(e) => setStep(e.target.value)}
          placeholder="detailed steps of your recipe (max. 500)"
        />
        <RecipeImageHandler
          name={`image-${index}`}
          image={image ?? ""}
          setImage={setImage}
          className="w-full grow h-[11rem] sm:h-[9rem] basis-1/3"
        />
      </div>
      <button
        className="h-fit"
        onClick={(e) => {
          e.preventDefault();
          deleteInstruction(id);
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

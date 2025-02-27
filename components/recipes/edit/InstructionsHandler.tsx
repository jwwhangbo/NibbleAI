"use client";
import InstructionForm, { type TInstruction } from "./InstructionForm";
import React, { useState } from "react";

export default function InstructionsHandler({ instructionProps }: { instructionProps?: {step:string, image:string}[] }) {
  const [maxId, setMaxId] = useState(
    instructionProps ? instructionProps.length : 3
  );
  const [instructions, setInstructions] = useState<TInstruction[]>(
    instructionProps
      ? instructionProps.map((prop, index) => ({ ...prop, id: index }))
      : Array.from({ length: 3 }, (_, i) => ({
          id: i,
          step: "",
          image: "",
        }))
  );

  const createNewInstructionEntry = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setMaxId((prevMaxId) => prevMaxId + 1);
    setInstructions((prev) => [...prev, { id: maxId, image: "", step: "" }]);
  };

  return (
    <div className="flex flex-col justify-center gap-4">
      {instructions.map((instruction, index) => (
        <InstructionForm
          instructionProps={instruction}
          key={index}
          index={index}
          setInstructions={setInstructions}
          deleteInstruction={(id) => {
            setInstructions((prev) => prev.filter((inst) => inst.id !== id));
          }}
        />
      ))}
      <button
        className="border-2 w-fit rounded-full border-black p-1 m-auto hover:bg-gray-200"
        onClick={createNewInstructionEntry}
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

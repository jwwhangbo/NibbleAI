import { type Question } from "@/lib/types";

export default function QuestionBoxOptions({ className, question, opt, idx }: { className?: string, question: Question, opt: string, idx: number }) {
  return (
    <li
      key={idx}
      className={className}
    >
      <input
        className="peer hidden"
        id={`${question.id.toString()}-${idx.toString()}`}
        type={question.type === "single_choice" ? "radio" : "checkbox"}
        name={question.id.toString()}
        value={opt}
      />
      <label
        className="block w-full cursor-pointer"
        htmlFor={`${question.id.toString()}-${idx.toString()}`}
      >
        {opt}
      </label>
      {opt === "Other" ? 
      <input
          className="mt-2 border-2 border-black rounded-md p-2 hidden peer-checked:block text-black w-full"
          type="text"
          name={question.id.toString()}
        /> : null}
    </li>
  );
}

import { type Question } from "@/lib/types";
import QuestionBoxOptions from "./questionBoxOptions";

interface QuestionBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    React.RefAttributes<HTMLDivElement> {
  question: Question;
  errors: Record<string, string>;
}

export default function QuestionBox (props : QuestionBoxProps) {
  const {
    style,
    className,
    question,
    errors,
    ref,
    id
  } = props;  
  return (
    <div id={id} ref={ref} style={style} className={`flex-shrink-0 ${className}`}>
      <div className="mb-[21px]">
        <span className="block">{question.question}</span>
        {errors[question.id.toString()] && (
          <span className="block text-red-500">
            {errors[question.id.toString()]}
          </span>
        )}
      </div>
      <ul className="space-y-2">
        {question.options.map((opt, idx) => (
          <QuestionBoxOptions
            className="p-[6px] has-[:checked]:bg-stone-700 has-[:checked]:text-white border-2 border-black rounded-md"
            key={idx}
            question={question}
            opt={opt}
            idx={idx}
          />
        ))}
      </ul>
    </div>
  );
}
import questions from "@/public/questions.json";

export default function Page() {
  return (
    <div className="max-w-[1200px] mx-auto">
      questionnaire page
      {/* <div className="w-full flex flex-row overflow-hidden overflow-x-scroll"> */}
        <form
          className="w-full flex flex-row overflow-hidden overflow-x-scroll"
          action={async (formData) => {
            "use server";
            console.log(formData);
          }}
        >
          {questions.map((q) => {
            return (
              <div className="flex-shrink-0" key={q.id}>
                <span>{q.question}</span>
                <ul className="space-y-2">
                  {q.options.map((opt, idx) => {
                    return (
                      <li
                        key={idx}
                        className="has-[:checked]:bg-blue-300 has-[:checked]:text-red-800 border-2 border-black rounded-md"
                      >
                        <input
                          className="hidden"
                          id={`${q.id.toString()}-${idx.toString()}`}
                          type={
                            q.type === "single_choice" ? "radio" : "checkbox"
                          }
                          name={q.id.toString()}
                          value={opt}
                          key={idx}
                        />
                        <label
                          className="block w-full cursor-pointer"
                          htmlFor={`${q.id.toString()}-${idx.toString()}`}
                        >
                          {opt}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          <button type="submit">submit</button>
        </form>
      {/* </div> */}
    </div>
  );
}

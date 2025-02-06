import { useState } from "react";

export default function TextareaWithCounter({className, onChange,...props} : React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [count, setCount] = useState<number>();
  
  return (
    <div className="relative">
      <textarea
        className={`${className} block px-4 pt-2 pb-[1.75rem] rounded-md border-2 focus:outline-none focus:ring focus:border-blue-500 resize-none`}
        onChange={(e) => {
          setCount(e.target.textLength);
        }}
        {...props}
      />
      <p className="absolute bottom-2 right-2 text-sm text-gray-500">
        {count}/{props.maxLength}
      </p>
    </div>
  );
}
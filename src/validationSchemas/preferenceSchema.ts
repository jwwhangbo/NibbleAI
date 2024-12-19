import * as Yup from "yup";
import questions from "@/public/questions.json";
import { type Question } from "@/lib/types";

const createPreferenceSchema = (questions: Question[]) => {
  const shape: Record<string, Yup.AnySchema> = {};

  questions.forEach((q) => {
      shape[q.id] = Yup.mixed()
        .test("is-string-or-array", "this field cannot be empty", (value) => {
          // Check if value is a string
          if (typeof value === "string") {
            return value.trim() !== ""; // Must not be an empty string
          }
          // Check if value is an array of strings
          if (Array.isArray(value)) {
            // Filter out empty strings and check if the resulting array is non-empty
            const nonEmptyStrings = value.filter(
              (item) => typeof item === "string" && item.trim() !== ""
            );
            return nonEmptyStrings.length > 0;
          }
          // Otherwise, the value is invalid
          return false;
        })
        .required("Field is required");
    }
  );

  return Yup.object().shape(shape);
};

export const preferenceSchema = createPreferenceSchema(questions);

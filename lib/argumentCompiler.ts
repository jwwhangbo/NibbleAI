'use server'
import questions from "@/public/questions.json"
import { type ResponseBody } from "./types"

export async function CompilePreferenceResponse(responseBody : ResponseBody) : Promise<Record<string, string | string[]>> {
  return questions.reduce((acc: Record<string, string | string[]>, curr) => {
    acc[curr.question] = responseBody[curr.id.toString()];
    return acc;
  }, {})
}
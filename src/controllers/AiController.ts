"use server";
import OpenAI from "openai";
import { CompilePreferenceResponse } from "@/lib/argumentCompiler";
import { type ResponseBody } from "@/lib/types";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { getUserPreference } from "./UserController";
import { catA, catB, dietary } from "../categories"; // Import categories

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const UserPreference = z.object({
  cooking_confidence: z.object({
    skill_level: z.string(),
    cooking_frequency: z.string(),
    dietary_restrictions: z.array(z.string()),
  }),
  available_ingredients: z.object({
    proteins: z.array(z.string()),
    vegetables_fruits: z.array(z.string()),
    pantry_staple: z.array(z.string()),
  }),
  region_preferences: z.object({
    region: z.string(),
    traditional_or_global: z.string(),
    cuisuine_preference: z.object({
      enjoy: z.array(z.string()),
      avoid: z.array(z.string()),
    }),
  }),
  time_and_effort: z.object({
    time_available: z.string(),
    kitchen_equipment: z.array(z.string()),
  }),
  flavor_preferences: z.object({
    enjoys: z.array(z.string()),
    dislikes: z.array(z.string()),
    textures: z.array(z.string()),
  }),
});

const category = z.object({
  categoryA: z.enum(catA),
  categoryB: z.enum(catB),
  dietary: z.enum(dietary).optional(),
});

const RecipeSchema = z.object({
  recipes: z.array(
    z.object({
      recipe_name: z.string(),
      recipe_category: category,
      recipe_description: z.string(),
      recipe_information: z.object({
        total_time: z.string(),
        servings: z.string(),
      }),
      major_ingredients: z.array(
        z.object({
          ingredient: z.string(),
          quantity: z.number(),
          unit: z.string(),
        })
      ),
      detailed_instruction: z.array(
        z.object({
          step: z.string(),
          image: z.enum([""]),
        })
      ),
    })
  ),
});


export type GeneratedRecipe = z.infer<typeof RecipeSchema>;

export async function GenerateUserPreference(responseBody: ResponseBody) {
  const compiledResponseBody = await CompilePreferenceResponse(responseBody);
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Create a summary by appropriately placing the response of a user's survey on cooking preferences",
      },
      { role: "user", content: JSON.stringify(compiledResponseBody) },
    ],
    model: "gpt-4o-mini",
    response_format: zodResponseFormat(UserPreference, "summary"),
  });
  return completion.choices[0].message.content;
}

export async function GenerateUserRecipes(userid : number) : Promise<string>{
  const userPreference = await getUserPreference(userid);
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: [
          "Generate 4 recipes based on the inputted preference object.",
          "Don't put too much emphasis on preferences, but take into account dislikes or avoids.",
          "Assume user is capable of buying or acquiring ingredients not in preferences.",
          "Try not to generate two recipes of the same categoryA",
          "Don't use Umami in recipe names.",
          "Provide more country or region specific ingredients.",
          "If",
          "cheese",
          "chili paste",
          "oil",
          "is in ingredients, provide specific name.",
          "Use real, existing recipes instead of making inspired recipes",
          "Generate between 7 to 11 detailed_instruction."
        ].join(" "),
      },
      { role: "user", content: JSON.stringify(userPreference) },
    ],
    model: "gpt-4o-mini",
    response_format: zodResponseFormat(RecipeSchema, "recipes"),
  });
  return completion.choices[0].message.content || "";
}

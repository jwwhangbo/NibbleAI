// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DefaultUser, Session } from "next-auth";

declare module "next-auth" {
  // Extend the default User type
  interface User extends DefaultUser {
    role?: string; // Add the role property (optional or required based on your needs)
  }

  // Extend the default Session type to include role
  interface Session {
    user: {
      role?: string;
    } & DefaultUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

export type LogoMap = {
  [key: string]: string;
};

export type Question = {
  id: number;
  question: string;
  type: string;
  options: string[];
};

export type ResponseBody = {
  [key: string]: string | string[];
};

interface RecipeData {
  userid: number;
  title: string;
  category: {
    categoryA: string;
    categoryB: string;
    dietary?: string | undefined;
  };
  info: { total_time: string; servings: string };
  thumbnail: string;
  description: string;
  ingredients: {
    ingredient: string;
    quantity: string;
    unit: string;
  }[];
  instructions: { step: string; image: string }[];
}

export type RecipeDraft = {
  recipe_id:string;
  last_saved?: Date;
} & RecipeData

export type Recipe = {
  date_created: Date;
  date_updated?: Date;
  public: boolean;
} & RecipeData;
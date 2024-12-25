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

export type Recipe = {
  recipe_name: string;
  recipe_description: string;
  major_ingredients: {
    ingredient: string;
    quantity: number;
    unit: string;
  }[];
  detailed_instruction: string[];
};
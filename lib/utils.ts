import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import map from "@/public/providerLogoMap.json" assert { type: "json" };
import { LogoMap } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const logoMap: LogoMap = map;

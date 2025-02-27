import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import map from "@/public/providerLogoMap.json" assert { type: "json" };
import { LogoMap } from "./types";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function validateCssUnitValue(value: string) {
  //  valid CSS unit types
  const CssUnitTypes = [
    "em",
    "ex",
    "ch",
    "rem",
    "vw",
    "vh",
    "vmin",
    "vmax",
    "%",
    "cm",
    "mm",
    "in",
    "px",
    "pt",
    "pc",
  ];

  // create a set of regexps that will validate the CSS unit value
  const regexps = CssUnitTypes.map((unit) => {
    // creates a regexp that matches "#unit" or "#.#unit" for every unit type
    return new RegExp(`^[0-9]+${unit}$|^[0-9]+\\.[0-9]+${unit}$`, "i");
  });

  // attempt to find a regexp that tests true for the CSS value
  const isValid = regexps.find((regexp) => regexp.test(value)) !== undefined;

  return isValid;
}

export const logoMap: LogoMap = map;

/**
 * Generates a unique image name using a timestamp and a random UUID.
 * @param file - The file object.
 * @returns {string} The unique image name.
 */
export const generateUniqueTag = (file: File): string => {
  const timestamp = Date.now();
  const randomString = uuidv4();
  const extension = file.name.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};
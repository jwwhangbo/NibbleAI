import { getAllRecipeIds } from "@/src/controllers/RecipeController";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://nibble-ai.com";
  const recipeids = await getAllRecipeIds();

  const recipeRoutes = recipeids.map((id) => ({
    url: `${baseUrl}/recipes/${id}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  const routes = ["", "/dashboard", "/recipes", "/saved", "/search"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...recipeRoutes];
}

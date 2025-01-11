"use client";

import { Recipe } from "@/lib/types";
import { useGalleryStore } from "@/src/providers/gallery-store-provider";
import { useEffect, useState } from "react";

export default function SavedGallery() {
  const [gallery, setGallery] = useState<Recipe[]>();
  const query = useGalleryStore((state) => state.query);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/collections?query=${query}`, {});
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const responseData = await response.json();
      setGallery(responseData.recipes);
      console.log(responseData.recipes);
    };
    fetchData();
  }, [query]);
  return (
    <div className="h-full grow">
      {gallery?.map((recipe, index: number) => (<div key={index}>{recipe.title}</div>))}
    </div>
  );
}

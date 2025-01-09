"use client";

import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { useEffect } from "react";

export default function SavedGallery({
  query
}: {
  query: string;
}) {
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/collections`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const responseData = response.json();
      console.log(responseData);
    };
    fetchData();
  }, []);

  return (
    <div className="h-full grow">
      {/* {response.map((recipe, index: number) => (<div key={index}>{recipe.title}</div>))} */}
    </div>
  );
}

import { fetchQueriedRecipes } from "@/src/controllers/RecipeController"
import Image from "next/image";
import placeholderImage from "@/public/landscape-placeholder.png"

export default async function RecipesTable({query, currentPage} : {query: string; currentPage:number}) {
  const searchResults = await fetchQueriedRecipes(query, currentPage);
  
  return (
    <div className="w-full pt-4 sm:flex sm:flex-col sm:gap-4">
      {searchResults.map((row) => 
        <div key={row.id} className="relative w-full sm:flex sm:flex-row sm:gap-2">
          <Image 
          src={row.images.length > 0 ? row.images[0] : placeholderImage} 
          alt="recipe thumbnail"
          width={200}
          height={200}
          style={{objectFit:"cover"}}
          className="block w-full sm:w-[200px] h-[200px]"
          />
          <div>
            <p><strong>{row.title}</strong></p>
            <p>{row.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
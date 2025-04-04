'use server';
import Pagination from "@/components/search/pagination";
import RecipesTable from "@/components/search/table";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import Search from "@/components/ui/search";
import { fetchRecipesPages } from "@/src/controllers/RecipeController";
import { Suspense } from "react";

export default async function Page({ searchParams } : { searchParams?: Promise<{query?: string; page?: number;}>}) {
  const params = await searchParams;
  const query = params?.query || "";
  const currentPage = params?.page || 1;
  const totalPages = await fetchRecipesPages(query);

  return (
    <main className="w-full px-[17px] mt-[12px] mb-2">
      <div className="block w-full mx-auto">
        <Search className="block w-full max-w-[800px] mx-auto" placeholder="Search" />
        <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
          <RecipesTable query={query} currentPage={currentPage} />
        </Suspense>
        <Pagination
          className="mt-2 mx-auto w-fit flex justify-center rounded-full py-1 px-2 bg-slate-100"
          totalPages={totalPages}
        />
      </div>
    </main>
  );
}

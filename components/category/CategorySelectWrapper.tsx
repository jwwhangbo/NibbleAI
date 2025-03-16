"use client";
import { CategorySelect } from "@/components/recipes/edit/categorySelect";
import { useRouter, useSearchParams } from "next/navigation";

function CategorySelectWrapper() {
  "use client";
  const params = useSearchParams();
  const searchParams = new URLSearchParams(params);
  const { replace } = useRouter();
  return (
    <CategorySelect
      initialValues={{
        categoryA: params.get("catA") ?? "",
        categoryB: params.get("catB") ?? "",
        dietary: params.get("dietary") ?? "",
      }}
      onValueChange={(value) => {
        if (value.categoryA) {
          searchParams.set("catA", value.categoryA);
        } else {
          searchParams.delete("catA");
        }
        if (value.categoryB) {
          searchParams.set("catB", value.categoryB);
        } else {
          searchParams.delete("catB");
        }
        if (value.dietary) {
          searchParams.set("dietary", value.dietary);
        } else {
          searchParams.delete("dietary");
        }
        searchParams.set("page", "1");
        replace(`/category?${searchParams.toString()}`);
      }}
    />
  );
}

export default CategorySelectWrapper;

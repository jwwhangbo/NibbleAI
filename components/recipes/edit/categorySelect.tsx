'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { catA, catB, dietary } from "@/src/categories";
import { useEffect, useState } from "react";

export function CategorySelect({
  initialValues,
  onValueChange,
}: {
  initialValues?: { categoryA: string; categoryB: string; dietary?: string };
  onValueChange?: (values: { categoryA: string; categoryB: string; dietary: string }) => void;
}) {
  const [categoriesData, setCategoriesData] = useState<{
    categoryA: string;
    categoryB: string;
    dietary: string;
  }>(initialValues ? { ...initialValues, dietary: initialValues.dietary ?? '' } : { categoryA: '', categoryB: '', dietary: '' });

  useEffect(() => {
    setCategoriesData(
      initialValues
        ? { ...initialValues, dietary: initialValues.dietary ?? "" }
        : { categoryA: "", categoryB: "", dietary: "" }
    );
  }, [initialValues]);

  useEffect(() => {
    if (
      onValueChange &&
      (categoriesData.categoryA !== initialValues?.categoryA ||
        categoriesData.categoryB !== initialValues?.categoryB ||
        categoriesData.dietary !== initialValues?.dietary)
    ) {
      onValueChange(categoriesData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesData]);

  return (
    <div className="flex gap-4">
      <Select
        name="categoryA"
        value={categoriesData.categoryA}
        onValueChange={(e) => {
          setCategoriesData((prev) => ({ ...prev, categoryA: e === "none" ? "" : e }));
        }}
      >
        <SelectTrigger className="w-[200px] text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue
            placeholder="Select meal type"
            className="w-full text-left"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Meal Types</SelectLabel>
            <SelectItem value="none">None</SelectItem> {/* Use "none" as the value */}
            {catA.map((item) => (
              <SelectItem key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1).replace("_", " ")}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        name="categoryB"
        value={categoriesData.categoryB}
        onValueChange={(e) => {
          setCategoriesData((prev) => ({ ...prev, categoryB: e === "none" ? "" : e }));
        }}
      >
        <SelectTrigger className="w-[200px] text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue
            placeholder="Select cuisine"
            className="w-full text-left"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Cuisines</SelectLabel>
            <SelectItem value="none">None</SelectItem> {/* Use "none" as the value */}
            {catB.map((item) => (
              <SelectItem key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1).replace("_", " ")}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        name="dietary"
        value={categoriesData.dietary}
        onValueChange={(e) => {
          setCategoriesData((prev) => ({ ...prev, dietary: e === "none" ? "" : e }));
        }}
      >
        <SelectTrigger className="w-[200px] text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue
            placeholder="Select dietary preference"
            className="w-full text-left"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Dietary Preferences</SelectLabel>
            <SelectItem value="none">None</SelectItem> {/* Use "none" as the value */}
            {dietary.map((item) => (
              <SelectItem key={item} value={item}>
                {item
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

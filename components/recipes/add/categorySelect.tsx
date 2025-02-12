import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { catA, catB, dietary } from "@/src/categories"

export function CategorySelect() {
  return (
    <div className="flex gap-4">
      <Select name="catA">
        <SelectTrigger className="w-[200px] text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue placeholder="Select meal type" className="w-full text-left" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Meal Types</SelectLabel>
            {catA.map((item) => (
              <SelectItem key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1).replace("_", " ")}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select name="catB">
        <SelectTrigger className="w-[200px] text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue placeholder="Select cuisine" className="w-full text-left" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Cuisines</SelectLabel>
            {catB.map((item) => (
              <SelectItem key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1).replace("_", " ")}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select name="dietary">
        <SelectTrigger className="w-[200px] text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue placeholder="Select dietary preference" className="w-full text-left" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Dietary Preferences</SelectLabel>
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
  )
}


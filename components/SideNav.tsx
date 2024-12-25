"use client";
import UserProfile from "@/components/ui/userProfile";
import { useNavbarStore } from "@/src/providers/navbar-store-provider";
import clsx from "clsx";

export default function SideNavbar() {
    const { active } = useNavbarStore((state) => state);
  return (
    <div
      className={
      clsx(["fixed h-screen w-[247px] bg-blue-200 flex-shrink-0 transition ease-in-out pointer-events-auto z-10", {"-translate-x-[247px]" : !active}])
      }
    >
      <UserProfile className="flex items-center w-full h-[56px] bg-red-100"/>

      <ul className="flex flex-col">
      <li className="p-4 hover:bg-gray-200 transition transitiion-duration-100">
        home
      </li>
      <li className="p-4 hover:bg-gray-200 transition transitiion-duration-100">
        Saved Recipes
      </li>
      <li className="p-4 hover:bg-gray-200 transition transitiion-duration-100">
        Support
      </li>
      </ul>
    </div>
  );
}

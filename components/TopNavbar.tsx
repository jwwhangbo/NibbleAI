"use client";
import Image from "next/image";
import logo from "@/public/logo.png";
import searchsvg from "@/public/svg/search-alt-1.svg";
import HamburgerButton from "@/components/ui/HamburgerButton";
import { useNavbarStore } from "@/src/providers/navbar-store-provider";
import clsx from "clsx";

export default function TopNavbar() {
  const { active } = useNavbarStore((state) => state);
  
  return (
    <div className={clsx(["bg-red-200 fixed w-screen min-w-[375px] h-[56px] shadow-md flex-shrink-0 pointer-events-auto transition ease-in-out z-10", {"translate-x-[247px]" : active}])}>
      <div className="flex w-full px-[17px] h-full justify-between">
        <HamburgerButton />
        <Image
          src={logo}
          width="33"
          height="36"
          alt="logo"
          style={{ width: "auto", height: "auto" }}
          quality={30}
          priority={true}
        />
        <Image
          src={searchsvg}
          width="32"
          height="32"
          alt="search"
          style={{ width: "auto", height: "auto" }}
        />
      </div>
    </div>
  );
}

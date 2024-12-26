"use client";
import Image from "next/image";
import logo from "@/public/logo.png";
import searchsvg from "@/public/svg/search-alt-1.svg";
import HamburgerButton from "@/components/ui/HamburgerButton";
import { useNavbarStore } from "@/src/providers/navbar-store-provider";
import clsx from "clsx";
import BackArrow from "./ui/back-arrow";

export default function TopNavbar({variant} : {variant:"back" | "hamburger"}) {
  const { active } = variant === 'hamburger' ? useNavbarStore((state) => state) : {active: false};
  
  return (
    <div
      className={clsx([
        "bg-white fixed w-screen min-w-[375px] h-[56px] shadow-md flex-shrink-0 pointer-events-auto transition ease-in-out z-10",
        { "translate-x-[247px]": active },
      ])}
    >
      <div className="flex w-full h-full px-[17px] justify-between items-center">
        {variant === "hamburger" ? <HamburgerButton /> : <BackArrow />}
        <Image
          src={logo}
          width="33"
          height="36"
          alt="logo"
          // style={{ width: "auto", height: "auto" }}
          quality={30}
          priority={true}
          className="h-fit"
        />
        <Image
          src={searchsvg}
          width="32"
          height="32"
          alt="search"
          // style={{ width: "auto", height: "auto" }}
          className="h-fit"
        />
      </div>
    </div>
  );
}

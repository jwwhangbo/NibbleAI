"use client";
import Image from "next/image";
import logo from "@/public/logo.png";
import searchsvg from "@/public/svg/search-alt-1.svg";
import HamburgerButton from "@/components/HamburgerButton";

export default function TopNavbar() {
  return (
    <div className="w-full min-w-[375px] h-[56px] shadow-md flex-shrink-0 pointer-events-auto">
      <div className="flex w-full px-[17px] h-full justify-between">
        <HamburgerButton />
        <Image src={logo} width="33" height="36" alt="logo" />
        <Image src={searchsvg} width="32" height="32" alt="search" />
      </div>
    </div>
  );
}

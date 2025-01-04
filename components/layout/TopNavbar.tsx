"use client";
import Image from "next/image";
import logoOnly from "@/public/logo_only.png";
import HamburgerButton from "@/components/ui/HamburgerButton";
import { useNavbarStore } from "@/src/providers/navbar-store-provider";
import clsx from "clsx";
import BackArrow from "@/components/ui/back-arrow";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNavbar({variant} : {variant:"back" | "hamburger"}) {
  const pathname = usePathname();
  const onSearch = pathname.split('/').includes('search');

  let active = false;
  try {
    const navbarStore = useNavbarStore((s) => s);
    active = variant === "hamburger" ? navbarStore.active : false;
  } catch (e) {
    if (variant === 'hamburger') {
      throw e;
    }
  }
  
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
          src={logoOnly}
          width="128"
          height="128"
          alt="logo"
          // style={{ width: "auto", height: "auto" }}
          quality={100}
          priority={true}
          className="h-[40px] w-[40px]"
        />
        {!onSearch ? (
          <Link href={"/recipes/search"}>
            <label htmlFor="search" className="sr-only">
              search
            </label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </Link>
        ) : (
          <div className="w-[32px] h-[32px]"></div>
        )}
      </div>
    </div>
  );
}

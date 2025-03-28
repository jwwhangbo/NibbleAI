"use client";
import Image from "next/image";
import logoLandscape from "@/public/logo_cropped_landscape.png";
import logoOnly from "@/public/logo_only.png";
import HamburgerButton from "@/components/ui/HamburgerButton";
import { useNavbarStore } from "@/src/providers/navbar-store-provider";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Navlinks from "./Navlinks";
import { useSession } from "next-auth/react";
import UserDropdownMenu from "./userDropdown";

export default function TopNavbar() {
  const { data: session, status } = useSession();
  const navbarStore = useNavbarStore((s) => s);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onSearch = pathname.split("/").includes("search");

  const generateCallbackUrl = () => {
    const params = new URLSearchParams();
    params.set(
      "callbackUrl",
      searchParams ? `${pathname}?${searchParams.toString()}` : pathname
    );
    return `/auth/signin?${params.toString()}`;
  };

  return (
    <div
      className={clsx([
        "bg-white fixed w-screen min-w-[375px] h-fit pointer-events-auto transition ease-in-out z-10",
        { "translate-x-[247px]": navbarStore.active },
      ])}
    >
      <div className="relative m-auto flex w-full max-w-[1200px] h-[56px] sm:h-[100px] px-[17px] sm:px-[30px] justify-between items-center">
        <HamburgerButton className="sm:!hidden" />
        <Link href={"/"} className="hidden sm:block h-2/5 w-fit">
          <Image
            src={logoLandscape}
            width="256"
            height="256"
            alt="logo"
            // style={{ width: "auto", height: "auto" }}
            quality={100}
            priority={true}
            className="h-full w-auto"
          />
        </Link>
        <Link href={"/"} className="sm:hidden">
          <Image
            src={logoOnly}
            width="256"
            height="256"
            alt="logo"
            // style={{ width: "auto", height: "auto" }}
            quality={100}
            priority={true}
            className="h-[40px] w-[40px]"
          />
        </Link>
        <div className="flex gap-4 items-center">
          {!onSearch ? (
            <Link href={"/search"} title="search">
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
          <div className="hidden sm:flex items-center">
            {status === "loading" ? (
              <div className="w-[32px] h-[32px]"></div>
            ) : session ? (
              <UserDropdownMenu user={session.user} />
            ) : (
              <Link href={generateCallbackUrl()} className="h-fit">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
      <Navlinks />
    </div>
  );
}

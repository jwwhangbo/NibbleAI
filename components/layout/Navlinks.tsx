"use client";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

export default function Navlinks() {
  const path = usePathname();
  const startsWith = path.split("/")[1];

  return (
    // <div className="hidden sm:flex m-auto items-center gap-2 h-[50px] max-w-[1200px] *:py-2 *:px-4 px-[30px] *:rounded-lg">
    //   <Link className={clsx({"font-bold bg-gray-200":path === "/"})} href="/">Home</Link>
    //   <span >Category</span>
    //   <Link className={clsx({"font-bold bg-gray-200":startsWith === "dashboard"})} href="/dashboard">Dashboard</Link>
    //   <Link className={clsx({"font-bold bg-gray-200":startsWith === "saved"})} href="/saved">Saved</Link>
    // </div>
    <NavigationMenu.Root className="hidden sm:flex flex-col relative max-w-[1200px] m-auto h-[50px] justify-center px-[30px]">
      <NavigationMenu.List className="flex gap-2">
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={clsx([
              "py-2 px-4 rounded-lg hover:bg-gray-200",
              { "font-bold bg-[#ffcd80] pointer-events-none": path === "/" },
            ])}
            href="/"
          >
            Home
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={clsx([
              "py-2 px-4 rounded-lg hover:bg-gray-200",
              { "font-bold bg-[#ffcd80] pointer-events-none": startsWith === "dashboard" },
            ])}
            href="/dashboard"
          >
            Dashboard
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={clsx([
              "py-2 px-4 rounded-lg hover:bg-gray-200",
              { "font-bold bg-[#ffcd80] pointer-events-none": startsWith === "saved" },
            ])}
            href="/saved"
          >
            Saved
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navlinks() {
  const path = usePathname();
  const startsWith = path.split('/')[1];

  return (
    <div className="hidden sm:flex m-auto items-center gap-2 h-[50px] max-w-[1200px] *:py-2 *:px-4 px-[30px] *:rounded-lg">
      <Link className={clsx({"font-bold bg-gray-200":path === "/"})} href="/">Home</Link>
      <span >Category</span>
      <Link className={clsx({"font-bold bg-gray-200":startsWith === "dashboard"})} href="/dashboard">Dashboard</Link>
      <Link className={clsx({"font-bold bg-gray-200":startsWith === "saved"})} href="/saved">Saved</Link>
    </div>
  );
}
"use client";
import UserProfile from "@/components/ui/userProfile";
import { useNavbarStore } from "@/src/providers/navbar-store-provider";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SideNavbar() {
  const { active } = useNavbarStore((state) => state);
  const {data : session} = useSession();
  const userData = session?.user;
  return (
    <div
      className={clsx([
        "sm:hidden fixed shadow-inner h-screen w-[247px] bg-white flex-shrink-0 transition-transform duration-75 z-10",
        { "-translate-x-[247px]": !active },
      ])}
    >
      {userData ? (
        <UserProfile
          className="flex justify-start items-center w-full px-4 h-[56px] bg-white border-b-2 m-auto gap-2"
          disabled
          user={userData}
        />
      ) : (
        <Link href="/signin" className="block font-bold w-full flex justify-center items-center px-4 h-[56px] border-b-2">Sign in</Link>
      )}

      <ul className="py-2 flex flex-col gap-2 *:mx-2 *:rounded-lg hover:*:bg-gray-200 *:transition *:transitiion-duration-100">
        <li>
          <Link
            className="block py-3 px-2"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link className="block py-3 px-2" href="/saved">
            Saved Recipes
          </Link>
        </li>
        <li className="py-3 px-2">Support</li>
      </ul>
    </div>
  );
}

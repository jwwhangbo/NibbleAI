"use client";
import UserProfile from "@/components/ui/userProfile";
import { useNavbarStore } from "@/src/providers/navbar-store-provider";
import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ManageButton, SignoutButton } from "../ui/profileButtons";

export default function SideNavbar() {
  const { active } = useNavbarStore((state) => state);
  const { data: session } = useSession();
  const userData = session?.user;
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
        "sm:hidden fixed shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.4);] w-[247px] h-dvh bg-white flex flex-col flex-shrink-0 transition-transform duration-75 z-10",
        { "-translate-x-[247px]": !active },
      ])}
    >
      {userData ? (
        <UserProfile
          className="flex justify-start items-center px-4 h-[56px] border-b-2 m-auto gap-2 grow-0"
          disabled
          user={userData}
        />
      ) : (
        <Link
          href={generateCallbackUrl()}
          className="block font-bold w-full flex justify-center items-center px-4 h-[56px] border-b-2 grow-0"
        >
          Sign in
        </Link>
      )}

      <div className="grow h-full flex flex-col justify-between">
        <ul className="py-2 flex flex-col gap-2 *:mx-2 *:rounded-lg hover:*:bg-gray-200 *:transition *:transitiion-duration-100">
          <li>
            <Link href="/" className="block py-3 px-2">
              Home
            </Link>
          </li>
          <li>
            <Link href="/category" className="block py-3 px-2">
              By Category
            </Link>
          </li>
          <li>
            <Link className="block py-3 px-2" href="/dashboard">
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
        {userData && <div className="flex flex-col gap-2 px-4 my-3">
          <ManageButton />
          <SignoutButton onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              signOut({ redirect: true, redirectTo: "/" });
            }} />
        </div>}
      </div>
    </div>
  );
}

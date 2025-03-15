import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import UserProfile from "../ui/userProfile";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import fallback from "@/public/landscape-placeholder.png"
import Link from "next/link";

export default function UserDropdownMenu({ user }: { user: Session["user"] }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="w-fit h-fit hover:ring rounded-full ring-transparent hover:ring-gray-200 transition ease-in-out duration-200 focused:outline-none">
          <UserProfile user={user} logoOnly disabled />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] rounded-md bg-gray-200 p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] z-10"
          sideOffset={5}
        >
          <DropdownMenu.Label className="text-sm px-[5px] py-2 flex flex-col gap-2 ">
            <Image
              src={user.image || fallback}
              height="100"
              width="100"
              alt="Profile picture"
              style={{
                borderRadius: "9999px",
                objectFit: "cover",
                margin: "auto",
                height: "100px",
                width: "100px",
              }}
            />
            <p className="text-center text-xl">
              Hello, {user.name}
              <br />
              <span className="text-sm">{user.email}</span>
            </p>
          </DropdownMenu.Label>
          <DropdownMenu.Item
            className="text-sm group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] text-[13px] leading-none text-black outline-none data-[highlighted]:bg-[#ffcd80] data-[highlighted]:cursor-pointer data-[disabled]:text-gray-500 data-[highlighted]:text-black"
            >
              <Link href="/edit">add new recipe</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="text-sm group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] text-[13px] leading-none text-black outline-none data-[highlighted]:bg-[#ffcd80] data-[highlighted]:cursor-pointer data-[disabled]:text-gray-500 data-[highlighted]:text-black"
            // disabled
            onSelect={(e: Event) => {
              e.preventDefault();
              signOut({ redirect: true, redirectTo: "/" });
            }}
          >
            Sign out{" "}
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className="fill-gray-200" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

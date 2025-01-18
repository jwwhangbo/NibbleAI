import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import UserProfile from "../ui/userProfile";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

export default function UserDropdownMenu({ user }: { user: Session["user"] }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="w-fit h-fit">
          <UserProfile user={user} logoOnly disabled />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] rounded-md bg-gray-200 p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
          sideOffset={5}
        >
          <DropdownMenu.Label className="text-sm px-[5px] h-[25px]">
            Hello, {user.name || user.email}
          </DropdownMenu.Label>
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

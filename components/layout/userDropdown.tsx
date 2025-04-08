import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import UserProfile from "../ui/userProfile";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { ManageButton, SignoutButton } from "../ui/profileButtons";

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
          className="min-w-96 rounded-md bg-white py-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] z-10 data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
          sideOffset={5}
          collisionPadding={{ right: 20 }}
        >
          <DropdownMenu.Label className="text-sm px-4 mt-2 flex flex-col gap-2 ">
            <UserProfile
              disabled
              user={user}
              displayEmail
              className="flex gap-2 items-center"
            />
          </DropdownMenu.Label>
          <DropdownMenu.Group className="flex gap-2 px-4 pl-12 my-3">
            <DropdownMenu.Item asChild>
              <ManageButton />
            </DropdownMenu.Item>
            <DropdownMenu.Item
              asChild
              onSelect={(e: Event) => {
                e.preventDefault();
                signOut({ redirect: true, redirectTo: "/" });
              }}
            >
              <SignoutButton />
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          {/* <DropdownMenu.Arrow className="fill-white" /> */}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

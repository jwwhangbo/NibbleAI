'use client'
import TopNavbar from "@/components/TopNavbar";
import SideNavbar from "./SideNav";
import { useNavbarStore } from "@/src/providers/navbar-store-provider";
import clsx from "clsx";

export default function Navbar({ user }: { user: {id: number, email: string, profileImage:string}}) {
  const { active } = useNavbarStore((state) => state,);
  return (
    <div className={clsx(["w-screen h-full flex transition ease-in-out"], {'-translate-x-[247px]': !active})}>
      <SideNavbar user={user} />
      <TopNavbar />
    </div>
  );
}

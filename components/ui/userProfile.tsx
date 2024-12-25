'use client'
import Image from "next/image";
import defaultUserImage from "@/public/defaultUserImage.jpg"
import { useSession } from "next-auth/react"

export default function NavbarUserProfile(props: React.HTMLAttributes<HTMLDivElement>) {
  const session = useSession();
  const userinfo = session?.data?.user;
  return (
    <div {...props}>
      <a
        className="flex justify-center items-center gap-2 w-fit m-auto"
        href={`/user/${userinfo?.id}`}
      >
        <Image
          className="rounded-full"
          src={userinfo?.profileImage || defaultUserImage}
          alt="User avatar"
          width="32"
          height="32"
        />
        <span>{userinfo?.email}</span>
      </a>
    </div>
  );
}
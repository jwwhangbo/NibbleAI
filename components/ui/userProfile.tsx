"use client";
import Image from "next/image";
import defaultUserImage from "@/public/defaultUserImage.jpg";

type ExtendedProps = {
  userImage?: string;
  userName: string;
  userId: number;
} & React.HTMLAttributes<HTMLDivElement>;

export default function NavbarUserProfile( {userId, userName, userImage,...props} : ExtendedProps ) {
  return (
    <div {...props}>
      <a
        className="flex justify-center items-center gap-2 w-fit m-auto"
        href={`/user/${userId}`}
      >
        <Image
          className="rounded-full w-[32px] h-[32px] grow-0"
          src={userImage || defaultUserImage}
          alt="User avatar"
          width="32"
          height="32"
          style={{ objectFit:'cover' }}
        />
        <span>{userName}</span>
      </a>
    </div>
  );
}

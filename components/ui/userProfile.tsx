import { auth } from "@/auth"
import Image from "next/image";
import defaultUserImage from "@/public/defaultUserImage.jpg"

export default async function NavbarUserProfile () {
    const session = await auth();

    if (!session?.user) return;

    return (
      <div className="flex items-center w-full h-[56px] bg-red-100">
        <a
          className="flex justify-center items-center gap-2 w-fit m-auto"
          href={`/user/${session.user.id}`}
        >
          <Image
            className="rounded-full"
            src={session.user.image || defaultUserImage}
            alt="User avatar"
            width="32"
            height="32"
          />
          <span>{session.user.email}</span>
        </a>
      </div>
    );
}
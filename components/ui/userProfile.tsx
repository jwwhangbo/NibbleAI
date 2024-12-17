import Image from "next/image";

export default function NavbarUserProfile({
  user,
}: {
  user: { id: number, email: string; profileImage: string };
}) {
  return (
    <div className="flex items-center w-full h-[56px] bg-red-100">
      <a
        className="flex justify-center items-center gap-2 w-fit m-auto"
        href={`/user/${user.id}`}
      >
        <Image
          className="rounded-full"
          src={user.profileImage}
          alt="User avatar"
          width="32"
          height="32"
        />
        <span>{user.email}</span>
      </a>
    </div>
  );
}
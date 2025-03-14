import { getRatingCountForUserId } from "@/src/controllers/RatingsController";
import { getUserInfo } from "@/src/controllers/UserController";
import Image from "next/image";
import Link from "next/link";

export default async function CommentUserProfile({
  userid,
}: {
  userid: number;
}) {
  const userData = await getUserInfo(userid);
  const ratingCount = await getRatingCountForUserId(userid);
  return (
    <div className="flex items-center mb-4">
      <Image
        src={userData.image}
        alt="profile image"
        width="32"
        height="32"
        style={{ objectFit: "cover" }}
        className="rounded-full me-4"
      />
      <Link href={`user/${userid}`} className="font-medium hover:underline leading-none">
        <span>{userData.name}<p className="text-sm">{ratingCount} reviews</p></span>
      </Link>
    </div>
  );
}

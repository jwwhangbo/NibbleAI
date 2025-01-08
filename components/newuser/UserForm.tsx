"use client";

import { Session } from "@auth/core/types";
import ProfilePictureChangeHandler from "@/components/newuser/ProfilePictureChangeHandler";
import { Upload } from "@/lib/R2Handler";
import { updateUserImage } from "@/src/controllers/UserController";

export default function UserForm({ session }: { session: Session | null }) {
  return (
    <form
      className="w-full flex flex-col justify-center items-center gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const file = formData.get("profile") as File;
        const username = formData.get("username");

        if (session && session.user?.id) {
          let url = null;
            if (file && file.size > 0) {
            url = await Upload(file, `user${session.user.id}/profile`);
            }
          await updateUserImage(session.user.id, url);
        }
      }}
    >
      <ProfilePictureChangeHandler userProfilePicture={session?.user?.image} />
      <input
        name="username"
        type="text"
        className="w-full max-w-[300px] rounded-md border-2 focus:ring focus:border-blue-500 focus:outline-none px-4 py-2"
        placeholder="Username"
        defaultValue={session?.user?.name || `user-${session?.user?.id}`}
        autoComplete="off"
      />
      <button
        type="submit"
        className="px-4 py-2 border-2 rounded-md border-black hover:bg-gray-200"
      >
        continue
      </button>
    </form>
  );
}

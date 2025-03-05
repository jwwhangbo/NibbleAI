"use client";

import ProfilePictureChangeHandler from "@/components/newuser/ProfilePictureChangeHandler";
import { Upload } from "@/lib/R2Handler";
import { updateUserImage, updateUsername } from "@/src/controllers/UserController";
import { redirect } from "next/navigation";
import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";

export default function UserForm() {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const session = useSession().data;
  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const file = formData.get("profile") as File;
    const username = formData.get("username") as string | null;

    if (session && session.user?.id) {
      let url = null;
      if (file && file.size > 0) {
        if (file.size > 5e6) {
          setError("file size too big. size must be < 5mb");
          return;
        }
        setError(undefined);
        url = await Upload(file, `user${session.user.id}/profile`);
        await updateUserImage(session.user.id, url);
      }
      if (username) {
        await updateUsername(session.user.id, username);
      } else {
        throw new Error("Username is required");
      }
      redirect('/auth/newuser/questionnaire')
    }
    else {
      throw new Error("Something went wrong while fetching user session. please try again later")
    }
  }
  return (
    <form
      className="w-full flex flex-col justify-center items-center gap-3"
      onSubmit={(e) => {startTransition(() => {
        handleSubmit(e);
      })}}
    >
      <ProfilePictureChangeHandler userProfilePicture={session?.user?.image} />
      {!!error && <p className="text-red-600">{error}</p>}
      <input
        name="username"
        type="text"
        className="w-full max-w-[300px] rounded-md border-2 focus:ring focus:border-blue-500 focus:outline-none px-4 py-2"
        placeholder="Username"
        defaultValue={session?.user?.name || `user-${session?.user?.id}`}
        autoComplete="off"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 border-2 rounded-md border-black hover:bg-gray-200 disabled:bg-gray-400"
        disabled={isPending}
      >
        continue
      </button>
    </form>
  );
}

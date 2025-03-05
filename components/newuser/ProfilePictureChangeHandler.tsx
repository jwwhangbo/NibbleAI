"use client";

import Image from "next/image";
import { useState } from "react";
import defaultProfilePicture from "@/public/defaultUserImage.jpg";

export default function ProfilePictureChangeHandler({
  userProfilePicture,
}: {
  userProfilePicture?: string | null;
}) {
  const [value, setValue] = useState<string>(userProfilePicture ?? "");
  return (
    <>
      <div
        className="relative w-[200px] rounded-full overflow-hidden"
        onClick={() => document.getElementById("file")?.click()}
      >
        <Image
          src={value ?? defaultProfilePicture}
          alt="profile-pic"
          width={200}
          height={200}
          style={{ objectFit: "cover" }}
          className={`rounded-full hover:cursor-pointer w-[200px] h-[200px] ${
            (value || userProfilePicture) &&
            value !== (defaultProfilePicture as unknown as string) &&
            "border-2"
          }`}
        />
        <span className="w-full py-3 absolute bottom-0 text-center text-white bg-blue-300 bg-opacity-50 pointer-events-none">
          Change
        </span>
      </div>
      <input
        id="file"
        name="profile"
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setValue(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
        }}
        className="hidden"
        accept="image/png, image/jpeg"
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          setValue(defaultProfilePicture as unknown as string);
          (document.getElementById("file") as HTMLInputElement)!.value = "";
        }}
        className="px-2 py-1 bg-gray-200 rounded-md"
      >
        remove photo
      </button>
    </>
  );
}

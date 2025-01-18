"use client";
import Image from "next/image";
import defaultUserImage from "@/public/defaultUserImage.jpg";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";

type UserProps = {
  image?: string;
  name: string;
  id: number;
  email: string;
};

const logoVariants = cva("rounded-full grow-0", {
  variants: { logoSize: { sm: "h-[24px] w-[24px]", md: "h-[32px] w-[32px]" } },
  defaultVariants: { logoSize: "md" },
});

export default function UserProfile({
  user,
  logoOnly = false,
  logoSize = "md",
  disabled = false,
  ...props
}: {
  user: UserProps;
  logoOnly?: boolean;
  disabled?: boolean;
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof logoVariants>) {
  const { image, name, id, email } = user;
  if (disabled) {
    return (
      <div {...props}>
        <Image
            className={cn(logoVariants({ logoSize }))}
            src={image || defaultUserImage}
            alt="User avatar"
            width="32"
            height="32"
            style={{ objectFit: "cover" }}
          />
          {!logoOnly && <span>{name || email}</span>}
      </div>
    );
  }
  return (
    <div {...props}>
      <Link
        className="flex justify-center items-center gap-2 w-fit m-auto hover:underline"
        href={`/user/${id}`}
      >
        <Image
          className={cn(logoVariants({ logoSize }))}
          src={image || defaultUserImage}
          alt="User avatar"
          width="32"
          height="32"
          style={{ objectFit: "cover" }}
        />
        {!logoOnly && <span>{name || email}</span>}
      </Link>
    </div>
  );
}

"use client";
import Image from "next/image";
import defaultUserImage from "@/public/defaultUserImage.jpg";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { roboto } from "@/components/ui/fonts";

type UserProps = {
  image?: string;
  name: string;
  id: number;
  email: string;
};

const logoVariants = cva("rounded-full grow-0", {
  variants: {
    logoSize: { sm: "h-[24px] w-[24px]", md: "h-[32px] w-[32px]" },
  },
  defaultVariants: { logoSize: "md" },
});

export default function UserProfile({
  user,
  logoOnly = false,
  logoSize = "md",
  disabled = false,
  displayEmail = false,
  ...props
}: {
  user: UserProps;
  logoOnly?: boolean;
  disabled?: boolean;
  displayEmail?: boolean;
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof logoVariants>) {
  const { image, name, id, email } = user;
  const { className, ...remainingProps } = props;
  if (disabled) {
    return (
      <div className={`${roboto.className} ${className}`} {...remainingProps}>
        <div className={`relative ${cn(logoVariants({ logoSize }))}`}>
          <div className="absolute inset-0 shadow-[inset_0_0_2px_0_rgba(0,0,0,0.3)] rounded-full" />
          <Image
            src={user.image || defaultUserImage}
            alt="User avatar"
            width="32"
            height="32"
            style={{ objectFit: "cover", borderRadius:"9999px" }}
          />
        </div>
        {!logoOnly && (
          <span>
            <p className="line-clamp-1 text-xs">{name}</p>
            {displayEmail && <p className="line-clamp-1 text-xs text-gray-400">{email}</p>}
          </span>
        )}
      </div>
    );
  }
  return (
    <div className={`${roboto.className} ${className}`} {...remainingProps}>
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
        {!logoOnly && <span className="line-clamp-1">{name || email}</span>}
      </Link>
    </div>
  );
}

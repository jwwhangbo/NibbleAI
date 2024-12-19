import Image from "next/image";
import Divider from "./ui/divider";
import { signIn, providerMap } from "@/auth";
import clsx from "clsx";
import EmailSigninHandler from "./EmailSigninHandler";

export default function Panel({
  callbackUrl,
  className,
}: {
  callbackUrl?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx([
        "min-w-[375px] max-w-[393px] h-full flex flex-col px-[30px] items-center gap-[9px] justify-center pb-[120px]",
        className,
      ])}
    >
      <Image
        className="mb-4"
        alt="logo"
        width="95"
        height="300"
        src="/logo.png"
      />
      <EmailSigninHandler callbackUrl={callbackUrl} />
      <Divider className="w-full flex flex-row items-center gap-[14px]" />
      {Object.values(providerMap).map((provider) => (
        <form
          key={provider.id}
          action={async () => {
            "use server";
            try {
              await signIn(provider.id, {
                redirectTo: callbackUrl,
              });
            } catch (error) {
              throw error;
            }
          }}
        >
          <button
            className="grayscale hover:grayscale-0 transition duration-300"
            type="submit"
          >
            <Image
              src={provider.logoUrl}
              width={32}
              height={32}
              alt="OAuth Signin Logo"
            />
          </button>
        </form>
      ))}
    </div>
  );
}

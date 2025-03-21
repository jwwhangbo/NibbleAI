import Image from "next/image";
import logo from "@/public/logo.png"
import Divider from "../ui/divider";
import { signIn, providerMap } from "@/auth";
import clsx from "clsx";
import EmailSigninHandler from "./EmailSigninHandler";

export default function Panel({
  callbackUrl,
  className,
  ...props
}: {
  callbackUrl: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx([
        "min-w-[375px] max-w-[393px] flex flex-col px-[30px] items-center gap-[9px] justify-center pb-[120px]",
        className,
      ])}
      {...props}
    >
      <Image
        className="mb-4"
        alt="logo"
        width="150"
        height="300"
        src={logo}
        style={{ width: "auto", height: "auto" }}
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

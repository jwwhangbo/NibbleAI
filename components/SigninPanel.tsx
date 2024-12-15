import Image from "next/image";
import Divider from "./ui/divider";
import { signIn, providerMap } from "@/auth";
import clsx from "clsx";

export default function Panel({ callbackUrl, className }: { callbackUrl?: string; className?:string }) {
  return (
    <div
      className={clsx(
        ["min-w-[375px] max-w-[393px] h-full flex flex-col px-[30px] items-center gap-[9px] justify-center pb-[120px]", 
        className]
      )}
    >
      <Image
        className="mb-4"
        alt="logo"
        width="95"
        height="300"
        src="/logo.png"
      />
      <form
        action={async (formData) => {
          "use server";
          const email = formData.get("email") || "";
          try {
            await signIn("http-email", {
              email: email,
              redirectTo: callbackUrl,
              redirect: true,
            });
            // TODO: popup dialog : email sent!
          } catch (err) {
            // if (!isRedirectError(err)) {
            //   console.log('redirect err');
            //   console.log(err);
            // }
            // return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
            throw err;
          }
        }}
        className="w-full flex flex-col gap-[9px]"
      >
        <input
          className="w-full h-[48px] px-[14px] py-[12px] rounded-[6px] border-2 border-black"
          placeholder="Email"
          type="email"
          name="email"
          id="email"
          required
        />
        <button
          className="py-[8px] bg-gray-800 rounded-md text-white"
          type="submit"
        >
          Continue with Email
        </button>
      </form>
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
              // Signin can fail for a number of reasons, such as the user
              // not existing, or the user not having the correct role.
              // In some cases, you may want to redirect to a custom error
              //   if (error instanceof AuthError) {
              //     return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
              //   }

              // Otherwise if a redirects happens Next.js can handle it
              // so you can just re-thrown the error and let Next.js handle it.
              // Docs:
              // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
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

import { auth } from "@/auth";
import Panel from "@/components/signin/SigninPanel";
import Image from "next/image";
import { redirect } from "next/navigation";
import signinBackdrop from "@/public/signin_backdrop.jpg"
import logoWhite from "@/public/logo_letters_white.png"
import { Quicksand } from "next/font/google"
import type { Metadata, ResolvingMetadata } from "next";

const quicksand = Quicksand({subsets: ['latin']});

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  {  }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parentMetaData = await parent;
  return {
    title: "Sign in | NibbleAI",
    description: "Sign in to nibble-ai.com",
    openGraph: {
      ...parentMetaData.openGraph,
      title: "Sign in | NibbleAI",
      description: "Sign in to nibble-ai.com",
      url: parentMetaData.openGraph?.url ?? undefined,
    },
  };
}

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl: string | undefined }>;
}) {
  const session = await auth();
  const callbackUrl = (await props.searchParams)?.callbackUrl ?? "/dashboard";
  if (session) {
    if (callbackUrl) {
      redirect(callbackUrl);
    }
    redirect("/");
  }
  return (
    <div className="flex h-dvh overflow-y-scroll w-screen">
      <div className="flex w-full lg:max-w-[520px]">
        <Panel className="m-auto" callbackUrl={callbackUrl} />
      </div>
      <div className="hidden relative lg:flex w-full">
        <Image
          src={signinBackdrop}
          alt="background"
          fill
          style={{ objectFit: "cover", zIndex: -10 }}
        />
        <div className="flex flex-col w-full justify-center items-center bg-black/50">
          <Image
            src={logoWhite}
            alt={"logo"}
            width={100}
            height={200}
            style={{ position: "absolute", right: "1rem", top: "1rem" }}
          />
          <div className="gap-4 flex flex-col">
            <span
              className={`text-center text-white ${quicksand.className} text-4xl`}
            >
              Try delicious recipes design by AI
            </span>
            <span
              className={`text-center text-white ${quicksand.className} text-2xl`}
            >
              Innovation meets incredible flavors
            </span>
            <span
              className={`text-center text-white ${quicksand.className} text-sm`}
            >
              Where technology meets taste. Enjoy expertly crafted, AI-generated Recipes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

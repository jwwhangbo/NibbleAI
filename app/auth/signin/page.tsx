import { auth } from "@/auth";
import Panel from "@/components/signin/SigninPanel";
import Image from "next/image";
import { redirect } from "next/navigation";
import recommendedHero from "@/public/hero_recommended.png"
import signinBackdrop from "@/public/signin_backdrop.jpg"
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
        <Image src={signinBackdrop} alt="background" fill style={{objectFit:"cover",zIndex:-10, opacity:0.7}}/>
        <div className="flex flex-col w-full justify-center items-center">
          <Image
            src={recommendedHero}
            alt="recommended-hero"
            width={600}
            height={400}
            style={{objectFit:"contain"}}
          />
          <p className={`text-center text-white ${quicksand.className} font-bold text-xl`}>Your Daily Recipes, Generated Just for you</p>
        </div>
      </div>
    </div>
  );
}

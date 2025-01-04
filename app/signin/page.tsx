import Panel from "@/components/signin/SigninPanel";

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl: string | undefined }>;
}) {
  const callbackUrl = (await props.searchParams)?.callbackUrl ?? "/dashboard";
  return (
    <div className="flex h-dvh w-screen">
      <div className="flex h-full w-full min-[800px]:max-w-[520px]">
        <Panel className="m-auto" callbackUrl={callbackUrl} />
      </div>
      <div className="hidden min-[800px]:flex w-full h-full bg-gray-300"></div> {/*TODO: change this to content*/}
    </div>
  );
}

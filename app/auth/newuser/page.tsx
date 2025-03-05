import UserForm from "@/components/newuser/UserForm";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function Page() {
  const session = await auth();
  return (
    <div className="w-full h-dvh flex flex-col justify-center items-center gap-3">
      <h2 className="text-2xl mb-6">This is how you will look</h2>
      <SessionProvider session={session}>
        <UserForm/>
      </SessionProvider>
    </div>
  );
}

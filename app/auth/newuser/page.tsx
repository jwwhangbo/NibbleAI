import UserForm from "@/components/newuser/UserForm";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return (
    <div className="w-full h-dvh flex flex-col justify-center items-center gap-3">
      <h2 className="text-2xl mb-6">This is how you will look</h2>
      <UserForm session={session} />
    </div>
  );
}

'use server'
import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import defaultUserImage from "@/public/defaultUserImage.jpg"
import { NavbarStoreProvider } from "@/src/providers/navbar-store-provider";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    throw new Error("you must be logged in!")
  }

  const user = {
    id : session?.user?.id,
    email : session?.user?.email || "",
    profileImage : session?.user?.image || defaultUserImage,
  }

  return (
    <div>
      <div className="fixed w-full h-full pointer-events-none">
        <NavbarStoreProvider>
          <Navbar user={user}/>
        </NavbarStoreProvider>
      </div>
      <div className="pt-[56px]">{children}</div>
    </div>
  );
}

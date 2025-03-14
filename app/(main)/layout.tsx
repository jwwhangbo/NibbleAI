import { auth } from "@/auth";
import { GoogleAdSense } from "@/components/Adsense/Google";
import SideNavbar from "@/components/layout/SideNav";
import TopNavbar from "@/components/layout/TopNavbar";
import { NavbarStoreProvider } from "@/src/providers/navbar-store-provider";
import { SessionProvider } from "next-auth/react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <>
      <SessionProvider session={session}>
        <NavbarStoreProvider>
          <TopNavbar />
          <SideNavbar />
        </NavbarStoreProvider>
      </SessionProvider>
      <div className="pt-[56px] sm:pt-[156px] max-w-[1200px] mx-auto">
        {children}
      </div>
      <GoogleAdSense/>
    </>
  );
}

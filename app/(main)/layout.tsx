import SideNavbar from "@/components/layout/SideNav";
import TopNavbar from "@/components/layout/TopNavbar";
import { NavbarStoreProvider } from "@/src/providers/navbar-store-provider";
import { SessionProvider } from "next-auth/react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <NavbarStoreProvider>
        <TopNavbar />
        <SideNavbar />
      </NavbarStoreProvider>
      <div className="pt-[56px] sm:pt-[106px] max-w-[1200px] mx-auto">
        {children}
      </div>
    </SessionProvider>
  );
}

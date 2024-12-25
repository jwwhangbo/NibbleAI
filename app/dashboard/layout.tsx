import SideNavbar from "@/components/SideNav";
import TopNavbar from "@/components/TopNavbar";
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
      <div className="pt-[56px]">{children}</div>
    </SessionProvider>
  );
}

import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="fixed w-full h-full flex">
        <SideNav />
        <Navbar />
      </div>
      <div className="pt-[56px]">{children}</div>
    </div>
  );
}

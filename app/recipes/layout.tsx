import TopNavbar from "@/components/layout/TopNavbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <TopNavbar variant="back" />
      <div className="pt-[56px]">{children}</div>
    </div>
  );
}
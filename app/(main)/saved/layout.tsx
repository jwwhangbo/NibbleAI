import { auth } from "@/auth";
import { getUserCollections } from "@/src/controllers/CollectionController";
import SavedSidebar from "@/components/saved/SavedSidebar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userid = session?.user?.id;
  const collections = getUserCollections(userid);
  return (
    <div className="flex flex-col sm:flex-row h-[calc(100dvh-56px)] sm:h-[calc(100dvh-106px)]">
      <SavedSidebar collectionPromise={collections} />
      {children}
    </div>
  );
}

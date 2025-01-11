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
  const collections = await getUserCollections(userid);
  return (
    <div className="h-[calc(100dvh-56px)] flex flex-col pt-4">
      <h1 className="text-3xl px-[17px]">Saved Recipes</h1>
      <div className="flex grow">
        <SavedSidebar collections={collections} />
        {children}
      </div>
    </div>
  );
}

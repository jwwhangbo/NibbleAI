"use client";
import UserProfile from "@/components/ui/userProfile";

export default function SideNavbar({
  user,
}: {
  user: { id: number, email: string; profileImage: string };
}) {
  return (
    <div className={("h-full w-[247px] bg-blue-200 flex-shrink-0 transition ease-in-out pointer-events-auto")}>
      <UserProfile user={user}/>
      <ul className="flex flex-col">
        <li className="p-4 hover:bg-gray-200 transition transitiion-duration-100">
          home
        </li>
        <li className="p-4 hover:bg-gray-200 transition transitiion-duration-100">
          Saved Recipes
        </li>
        <li className="p-4 hover:bg-gray-200 transition transitiion-duration-100">
          Support
        </li>
      </ul>
    </div>
  );
}

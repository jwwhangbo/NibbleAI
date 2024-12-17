import { auth, signOut } from "@/auth"

export default async function Page() {
    const session = await auth();
    return (
        <div className="h-[1200px] bg-gray-200">
            <span>welcome!</span>
            <span>{session?.user?.id}</span>
            <form action={async () => {
                "use server"
                await signOut({redirectTo:'/signin'});
            }}>
                <button type="submit">
                    sign out
                </button>
            </form>
        </div>
    );
}
import { auth, signOut } from "@/auth"

export default async function Page() {
    const session = await auth();
    return (
        <div>
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
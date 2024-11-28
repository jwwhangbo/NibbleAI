import { signIn } from "@/auth";

export default function SignIn({
  provider}: { provider?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
    >
      <button> Sign In</button>
    </form>
  );
}

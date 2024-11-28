import { signIn, providerMap } from "@/auth";

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined };
}) {
  return (
    <div className="flex flex-col gap-2">
      {Object.values(providerMap).map((provider) => (
        <form
          key={provider.id}
          action={async () => {
            "use server";
            try {
              await signIn(provider.id, {
                redirectTo: props.searchParams?.callbackUrl ?? "",
              });
            } catch (error) {
              // Signin can fail for a number of reasons, such as the user
              // not existing, or the user not having the correct role.
              // In some cases, you may want to redirect to a custom error
              //   if (error instanceof AuthError) {
              //     return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
              //   }

              // Otherwise if a redirects happens Next.js can handle it
              // so you can just re-thrown the error and let Next.js handle it.
              // Docs:
              // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
              throw error;
            }
          }}
        >
          <button className="p-4 bg-gray-400 rounded-md" type="submit">
            <span>Sign in with {provider.name}</span>
          </button>
        </form>
      ))}
      <form
        action={async (formData) => {
          "use server";
          try {
            await signIn("http-email", formData, { callbackUrl: "/dashboard" });
          } catch (err) {
            console.log(err);
            // return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
            throw err;
          }
        }}
      >
        <label htmlFor="email">
          Email
          <input className="border-2 rounded-md p-1" name="email" id="email"/>
        </label>
        <button className="py-2 px-3 ml-2 bg-gray-400 rounded-md" type="submit">
          <span>Sign in</span>
        </button>
      </form>
    </div>
  );
}

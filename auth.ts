import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { sendVerificationRequest } from "./lib/authSendRequest";
import { Pool } from "@neondatabase/serverless";

const providers: Provider[] = [
  Google,
  {
    id: "http-email",
    name: "Email",
    type: "email",
    maxAge: 60 * 60 * 24,
    apiKey: process.env.EMAIL_API,
    from: process.env.EMAIL_FROM,
    sendVerificationRequest,
  },
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "http-email");

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return {
    adapter: PostgresAdapter(pool),
    callbacks: {
      signIn : async ({ account }) => {
        if (!account) {
          return '/welcome';
        }
        return true;
      },
      session({ session, user }) {
        session.user.id = user.id;
        return session;
      },
      authorized: async ({ request: { nextUrl }, auth }) => {
        // Logged in users are authenticated, otherwise redirect to login page
        const isLoggedIn = !!auth?.user;
        const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
        if (isOnDashboard) {
          if (isLoggedIn) return true;
          return false; // Redirect unauthenticated users to login page
        } else if (isLoggedIn) {
          if (nextUrl.pathname.startsWith("/signin")){
            return Response.redirect(new URL("/dashboard", nextUrl));
          }
        }
        return true;
      },
    },
    providers,
    pages: {
      signIn: "/signin",
    },
  };
});

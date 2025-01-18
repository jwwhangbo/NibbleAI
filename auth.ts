import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { sendVerificationRequest } from "./lib/authSendRequest";
import { logoMap } from "./lib/utils";
import { pool } from "./src/utils/db";
import { revalidatePath } from "next/cache";

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
      return {
        id: providerData.id,
        name: providerData.name,
        get logoUrl() {
          return logoMap[providerData.name];
        },
      };
    } else {
      return {
        id: provider.id,
        name: provider.name,
        get logoUrl() {
          return logoMap[provider.name];
        },
      };
    }
  })
  .filter((provider) => provider.id !== "http-email");

export const { handlers, auth, signIn, signOut } = NextAuth({
    // debug:true,
    // @ts-expect-error This is not an error!! someone should update the typing for this!
    adapter: PostgresAdapter(pool),
    callbacks: {
      session({ session, user }) {
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.image = user.image;
        session.user.role = user.role;
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
          // return Response.redirect(new URL("/dashboard", nextUrl)); // TODO: fix this to allow for flexible url routing
        }
        return true;
      },
    },
    events: {
      async signIn() {
        'use client';
        await revalidatePath('/auth/signin');
      }
    },
    providers,
    pages: {
      signIn: "/auth/signin",
      newUser: "/auth/newuser",
      error: "/auth/error"
    },
});

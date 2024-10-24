import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnAuthPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/signup" || nextUrl.pathname === "/email/verify" || nextUrl.pathname === "/email/verify/send";

      if (!isLoggedIn) {
        return isOnAuthPage; // Allow access to auth pages if not logged in
      }

      if (isOnAuthPage) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

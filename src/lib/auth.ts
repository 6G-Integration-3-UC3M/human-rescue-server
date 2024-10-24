import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import prisma from "@/lib/prisma";

import type { NextAuthConfig } from "next-auth/lib/index";

import { authConfig } from "@/auth.config";

// More info: https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
    interface Session {
        user: {} & DefaultSession["user"];
    }
}

export const conf = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    callbacks: {
        async session({ token, session }: { token: any; session: any }) {
            if (session.user) {
                console.log("token: ", token);
                if (token.sub) {
                    session.user.id = token.sub;
                }

                if (token.email) {
                    session.user.email = token.email;
                }

                session.user.name = token.name;
            }

            return session;
        },

        async jwt({ token }: any) {
            if (!token.sub) return token;
            const dbUser = await prisma.user.findUnique({
                where: {
                    id: token.sub,
                },
            });

            if (!dbUser) return token;

            token.name = dbUser.name;
            token.email = dbUser.email;

            return token;
        },
    },
    ...authConfig,
    debug: process.env.NODE_ENV !== "production",
} as NextAuthConfig | any;

export const {
    handlers: { GET, POST },
    signIn,
    signOut,
    auth,
} = NextAuth(conf);

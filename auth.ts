import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/db/prisma";
import { compare } from "bcrypt-ts-edge";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (user && user.password) {
          const isValid = await compare(
            credentials.password as string,
            user.password
          );
          if (isValid) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();

        const reqHeaders = new Headers(request.headers);

        const response = NextResponse.next({
          request: {
            headers: reqHeaders,
          },
        });

        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else return true;
    },
  },
});

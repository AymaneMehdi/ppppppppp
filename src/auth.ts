import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            return null;
          }

          const user = await response.json();
          return user;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
        token.role = user?.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      // user id is stored in ._id when using credentials provider
      if (token?._id) {
        session.user._id = token._id as string;
      }
      // user id is stored sub ._id when using google provider
      if (token?.sub) {
        session.user._id = token.sub as string;
      }

      if (token?.role) {
        session.user.role = token.role as string;
      }
      // we'll update the session object with those
      // informations besides the ones it already has
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

declare module "next-auth" {
  interface Session {
    id: string;
    role: string;
  }

  interface User {
    _id?: string;
    role?: string;
  }
}

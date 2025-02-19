import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";


export const authOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token }) => {
        if (!token?.email) return token;
      
        const db_user = await prisma.user.findFirst({
          where: { email: token.email },
        });
      
        if (db_user) {
          return {
            ...token,
            id: db_user.id,
          };
        }
      
        return token;
      },
      
      session: ({ session, token }) => {
        if (session.user) {
          session.user.id = token.id ;
          session.user.name = token.name ;
          session.user.email = token.email ;
          session.user.image = token.picture ;
        }
        return session;
      }
      ,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const getAuthSession = () => {
  return getServerSession(authOptions);
};
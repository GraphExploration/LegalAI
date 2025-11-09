import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {}

        if (email === "admin@legalai.com" && password === "Hello@123") {
          return { id: "1", name: "Admin User", email }
        }

        return null 
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" }, // now TypeScript knows this is valid
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

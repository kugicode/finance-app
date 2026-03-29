import { authOptions } from "@/lib/auth";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth";

//The main engine that handels google login
const handler = NextAuth(authOptions);

//We tell Next.js to use this handler for both GET and POST requests
export {handler as GET, handler as POST}
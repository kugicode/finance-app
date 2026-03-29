import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "./mongodb";

export const authOptions: NextAuthOptions = {
    //Tell NextAuth to save users in mongodb!
    adapter: MongoDBAdapter(clientPromise),

    //Setup the google provider
    providers: [
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID!,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET!
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
}
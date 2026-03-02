import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";


export async function GET() {
    try {
        //We use await to wait for the database to be successful! and clientPromise contains the MongoClient object, so we could use tools like .db() .collection() etc.
        const client = await clientPromise;
        //db is our database we are fetching it!
        const db = client.db("Finance-App");
        //Now we are fetching the collection of that database
        const collection = db.collection("transactions");
        //We are getting all the transactions in the trasnactions collection find({}) the {} means all.
        const transactions = await collection.find({}).toArray();
        //return as json
        return NextResponse.json(transactions);
    } catch (error) {
        console.error("GET Error:", error);
        //send error as json!
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }
}
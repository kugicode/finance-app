import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET: Fetches transactions ONLY for the logged-in user.
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user?.email){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const client = await clientPromise;
        const db = client.db("Finance-App");
        const collection = db.collection("transactions");

        // ONLY fetch transactions that match the user's email
        const transactions = await collection.find({userEmail: session.user.email}).toArray();
        
        const mappedTransactions = transactions.map(item => ({...item, id: item._id.toString()}))
        return NextResponse.json(mappedTransactions);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }
}

/**
 * POST: Saves a new transaction with the user's email attached.
 */
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if(!session || !session.user?.email){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const body = await request.json();
        const { amount, category, type, date } = body;

        if(typeof amount !=='number' || amount <= 0 || !category || category.trim() === "" || !['income', 'expense'].includes(type) || !date){
            return NextResponse.json({ error: "Missing or invalid fields!" }, { status: 400 });
        };

        const client = await clientPromise;
        const db = client.db("Finance-App");
        const collection = db.collection("transactions");

        const newEntry = { 
            amount, 
            category, 
            type, 
            date: new Date(date), 
            userEmail: session.user.email // Tagging the data!
        };
        const result = await collection.insertOne(newEntry);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: "Failed to save transaction" }, { status: 500 });
    }
}

/**
 * DELETE: Only allows deleting if the user owns the transaction.
 */
export async function DELETE(request: Request){
    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user?.email){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        const client = await clientPromise;
        const db = client.db("Finance-App");
        const collection = db.collection("transactions");

        const result = await collection.deleteOne({
            _id: new ObjectId(id as string),
            userEmail: session.user.email // Security check!
        });
        return NextResponse.json({message: "Deleted successfully", result});
    } catch(error){
        console.error("DELETE Error:", error);
        return NextResponse.json({error: "Failed to delete transaction"}, {status: 500});
    }
}

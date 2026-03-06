import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * GET: Fetches all transactions from the database.
 */
export async function GET() {
    try {
        // 1. Establish database connection
        const client = await clientPromise;
        const db = client.db("Finance-App");
        const collection = db.collection("transactions");

        // 2. Retrieve all documents as an array
        const transactions = await collection.find({}).toArray();

        return NextResponse.json(transactions);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}

/**
 * POST: Validates and saves a new transaction.
 */
export async function POST(request: Request) {
    try {
        // 1. Unpack the incoming request body
        const body = await request.json();
        const { amount, category, type, date } = body;

            //Robust validation! check if fields are missing OR have wrong data!
            if(
                typeof amount !=='number' || amount <= 0 ||
                !category || category.trim() === "" ||
                !['income', 'expense'].includes(type) ||
                !date
            ){
            return NextResponse.json(
                { error: "Wait! You forgot some fields!" },
                { status: 400 }
            )
        };
        // 3. Database connection
        const client = await clientPromise;
        const db = client.db("Finance-App");
        const collection = db.collection("transactions");

        // 4. Create the new document (saving only the fields we want)
        const newEntry = { amount, category, type, date: new Date(date) };
        const result = await collection.insertOne(newEntry);

        // 5. Return the result with a 201 "Created" status
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json(
            { error: "Failed to save transaction" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request,){
    try{
    //Grab the ID from the URL search query!
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    //Database connection
    const client = await clientPromise;
    const db = client.db("Finance-App");
    const collection = db.collection("transactions");
        //Delete this id requested from the collection!
    const result = await collection.deleteOne({_id: new ObjectId(id as string)});
    return NextResponse.json({message: "Transaction deleted sucessfully", result});
    }
    catch(error){
        console.error("DELETE Error:", error);
        return NextResponse.json({error: "Failed to delete transaction"}, {status: 500});
    }
    
}
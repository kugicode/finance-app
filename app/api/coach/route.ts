import clientPromise from "@/lib/mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET () {
    try{
    //Awaiting client promise so we get the mongodb object
    const client = await clientPromise;
    //saving the databases name as db
    const db = client.db('Finance-App');
    const collection = db.collection('transactions');
    
    //Storing my api key in a variable called genAI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    //Picking the model we are using
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

        //Getting all the transaction data from mongodb and filtering and adding the income and expenses in seperate varaibles
    const transactions = await collection.find({}).toArray();
    //
    let summary = "";
    summary = transactions.map((item) => item.type + " - " + item.category + ": £" + item.amount).join(", ");

        const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, current) => acc + current.amount, 0);
        const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, current) => acc + current.amount, 0);
        //The prompt we will use for the AI to see.
        const prompt = `
        Here is a list my user's spendings: ${summary}. Give them one specific tip, please make it short and simple!`;
        //We are giving the model the prompt!
        const result = await model.generateContent(prompt);
        //Extracting the actual message.
        const advice = await result.response.text();
        return NextResponse.json({ advice });
    }

    catch(error){
        console.log(error);
        return NextResponse.json({message: "Sorry an error has occured!"});
    }
    }
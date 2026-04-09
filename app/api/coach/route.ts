import clientPromise from "@/lib/mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db('Finance-App');
        const collection = db.collection('transactions');

        // Fetch ONLY this user's data for the AI to analyze
        const transactions = await collection.find({ userEmail: session.user.email }).toArray();

        if (transactions.length === 0) {
            return NextResponse.json({ advice: "Add some transactions so I can give you personalized advice! 📈" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let summary = transactions.map((item) => `${item.type} - ${item.category}: £${item.amount}`).join(", ");

        const prompt = `You are a financial coach. Here is a list of my user's spending: ${summary}. Give them ONE specific, friendly tip. Keep it short!`;

        const result = await model.generateContent(prompt);
        const advice = await result.response.text();

        return NextResponse.json({ advice });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Sorry an error occurred!" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";

//A test get route 
export async function GET(){
    // returning on json.
return NextResponse.json({message: "Hello from backend"});
}
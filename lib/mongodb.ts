import {MongoClient} from 'mongodb';
//That's the mongodb connection string in .env file.
const uri = process.env.MONGODB_URI;

if(!uri){
throw new Error('Please add your Mongo URI to .env.local!');
}
//Telling typescript client can only hold Mongoclient the connection tool.
let client : MongoClient;
//telling typescript that clientPromise can only hold a promise of that tool which will surely arrive.
let clientPromise: Promise<MongoClient>;

if(process.env.NODE_ENV === 'development'){ //In development mode(when I run npm run dev), use a golbal variable so we don't crash the database with reloads.
    //@ts-ignore
    if(!global._mongoClientPromise){
client = new MongoClient(uri);
//@ts-ignore
    global._mongoClientPromise = client.connect();
    }
    //@ts-ignore
    clientPromise = global._mongoClientPromise
}
else{
client = new MongoClient(uri)
clientPromise = client.connect();
}

export default clientPromise
import { MongoClient } from "https://deno.land/x/mongo@v0.7.0/mod.ts";

const client = new MongoClient();
await client.connectWithUri("mongodb://localhost:27017");

const db = client.database("denoExample");
const task_collection = db.collection("tasks");

console.log("Database connected!!")

export default task_collection;
// src/app/budget/route.js

import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("finance");

    const budgets = await db.collection("budgets").find({}).toArray();

    return Response.json({ success: true, data: budgets });
  } catch (error) {
    console.error("Failed to fetch budgets:", error);
    return Response.json(
      { success: false, message: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.category || typeof body.amount !== "number" || !body.month) {
      return Response.json(
        { success: false, message: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("finance");

    const result = await db.collection("budgets").updateOne(
      { category: body.category, month: body.month },
      { $set: { amount: body.amount } },
      { upsert: true }
    );

    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("Failed to save budget:", error);
    return Response.json(
      { success: false, message: "Failed to save budget" },
      { status: 500 }
    );
  }
}

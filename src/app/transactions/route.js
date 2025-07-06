import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("finance");
    const transactions = await db.collection("transactions").find({}).toArray();

    return Response.json({ success: true, data: transactions });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, date, description, category } = body;

    if (!amount || !date || !description || !category) {
      return Response.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("finance");
    const result = await db.collection("transactions").insertOne({
      amount,
      date,
      description,
      category,
    });

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to add transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ success: false, message: "Missing ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("finance");

    const result = await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return Response.json({ success: true });
    } else {
      return Response.json({ success: false, message: "Not found" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, amount, date, description, category } = body;

    if (!id || !amount || !date || !description || !category) {
      return Response.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("finance");

    const result = await db.collection("transactions").updateOne(
      { _id: new ObjectId(id) },
      { $set: { amount, date, description, category } }
    );

    if (result.modifiedCount === 1) {
      return Response.json({ success: true });
    } else {
      return Response.json({ success: false, message: "Update failed" }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to update" }, { status: 500 });
  }
}

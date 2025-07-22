import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET() {
  try {
    const conversations = await db.conversation.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 },
    );
  }
}

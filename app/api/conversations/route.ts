import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { auth } from "@/app/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    const conversations = await db.conversation.findMany({
      where: {
        userId: session?.user.id,
      },
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

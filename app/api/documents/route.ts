import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { auth } from "@/app/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    // Guard clause: if user is not authenticated, return empty array
    if (!session?.user?.id) {
      return NextResponse.json([]);
    }

    const documents = await db.document.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        documentData: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 },
    );
  }
}

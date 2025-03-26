import { NextResponse } from "next/server";
import db from "../../lib/db";

export async function GET() {
  try {
    const documents = await db.document.findMany({
      include: {
        documentData: {
          select: {
            data: true,
          },
        },
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

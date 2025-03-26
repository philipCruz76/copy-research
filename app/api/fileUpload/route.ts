import db from "@/app/lib/db";
import { getSignedURL } from "@/app/lib/storage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON request body
    const body = await request.json();
    const { documentId, fileType, fileSize, checksum } = body;

    // check if the document has already been indexed
    const documentHashes = await db.documentHashes.findMany({
      where: {
        hash: checksum,
      },
    });

    if (documentHashes.length > 0) {
      return NextResponse.json(
        {
          message: "Document already indexed in database",
        },
        { status: 400 },
      );
    }

    console.log("Upload request received:", {
      documentId,
      fileType,
      fileSize,
      checksum,
    });

    const signedUrl = await getSignedURL(
      documentId,
      fileType,
      fileSize,
      checksum,
    );

    return NextResponse.json(
      {
        message: "Signed URL generated successfully",
        signedUrl,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}

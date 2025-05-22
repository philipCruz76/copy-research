import { getCacheStats, clearExpiredCache } from "@/app/lib/ai/documentCache";
import { NextResponse } from "next/server";

// GET handler to retrieve cache statistics
export async function GET() {
  try {
    const stats = getCacheStats();
    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error getting cache stats:", error);
    return NextResponse.json(
      { error: "Failed to get cache statistics" },
      { status: 500 },
    );
  }
}

// POST handler to clear expired cache entries
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "clear_expired") {
      const result = clearExpiredCache();
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error managing cache:", error);
    return NextResponse.json(
      { error: "Failed to manage cache" },
      { status: 500 },
    );
  }
}

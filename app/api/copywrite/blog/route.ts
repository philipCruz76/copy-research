import { getVectorDb } from "@/app/lib/ai/store";
import { generateBlogPost } from "@/app/lib/copywrite/generateBlogPost";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { topic, title, style, audience, keywords } = await req.json();

  try {
    console.log("Getting context from vector db");
    const vectorDb = await getVectorDb();

    const context = await vectorDb.similaritySearch(topic, 3);

    const contextString = context.map((doc) => doc.pageContent).join("\n");

    const blogPost = await generateBlogPost(
      title,
      topic,
      style,
      audience,
      keywords,
      contextString,
    );

    return NextResponse.json({ output: blogPost }, { status: 200 });
  } catch (error) {
    console.error("Error generating blog post", error);
    return NextResponse.json(
      { error: "Failed to generate blog post" },
      { status: 500 },
    );
  }
}

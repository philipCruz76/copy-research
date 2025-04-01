import { getVectorDb } from "@/app/lib/ai/store";
import { generateBlogPost } from "@/app/lib/copywrite/generateBlogPost";
import { parseSubjectMatter } from "@/app/lib/copywrite/parseSubjectMatter";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { subject, tone } = await req.json();

  try {
    const topic = await parseSubjectMatter(subject);

    if (!topic) {
      return NextResponse.json(
        { error: "Failed to parse subject matter" },
        { status: 500 },
      );
    }
    console.log("Topic:", topic);

    console.log("Getting context from vector db");
    const vectorDb = await getVectorDb("url-document");

    const context = await vectorDb.similaritySearch(subject, 3);

    const contextString = context.map((doc) => doc.pageContent).join("\n");

    const blogPost = await generateBlogPost(
      topic,
      subject,
      tone,
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

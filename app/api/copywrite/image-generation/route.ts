import { experimental_generateImage as generateImage } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { generateImagePrompt } from "@/app/lib/copywrite/generateImagePrompt";

export async function POST(req: Request) {
  const { blogContent } = await req.json();

  try {
    // Based on the content of the blog generate a prompt to use in image generation
    const prompt = await generateImagePrompt(blogContent);

    console.log(prompt);

    // Generate the image
    const image = await generateImage({
      model: openai.image("dall-e-3"),
      prompt,
      size: "1024x1024",
      n: 1,
      seed: 55895,
    });

    return NextResponse.json({ output: image.image.base64 }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}

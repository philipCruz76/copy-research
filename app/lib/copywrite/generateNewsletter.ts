"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { ChatMessage } from "../types/gpt.types";

export async function generateNewsletter(blogContent: string) {
  const SYSTEM_PROMPT = `
    You are a professional copywriter specializing in converting blog posts into engaging newsletters. Your task is to transform the provided blog post into a concise, engaging newsletter format.

    ## **STRICT CONTENT ACCURACY RULES:**
    1. **Use Only the Given Blog Content**  
       - The newsletter **must strictly adhere** to the information provided in the blog post.
       - You **must not introduce new facts, assumptions, or information** that are not in the original blog post.
       - Preserve the key messages and main points from the original content.

    2. **Maintain the Same Tone and Style**  
       - Keep the same tone (formal/casual) as the original blog post.
       - Preserve key technical terminology while making the newsletter more concise.

    3. **Newsletter Structure:**  
       - Create an attention-grabbing subject line.
       - Add a brief, friendly introduction.
       - Transform the blog content into scannable sections with clear headings.
       - Include a clear call-to-action at the end.
       - Keep the total length around 50% of the original blog post.
       
    4. **Format:**
       - Use Markdown formatting for the newsletter.
       - Include clear section breaks and bullet points where appropriate.
       - Make the content more scannable and easier to read.
  `;

  const USER_PROMPT = `
    Transform the following blog post into an engaging newsletter format:

    ${blogContent}
  `;

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: USER_PROMPT },
  ];

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    messages,
    maxTokens: 1000,
    temperature: 0.7,
  });

  return result.text;
}

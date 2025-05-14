"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { GPTPrompt } from "../types/gpt.types";

export async function generateSummary(blogContent: string) {
  const SYSTEM_PROMPT = `
    You are a professional copywriter specializing in creating concise summaries of blog posts. Your task is to transform the provided blog post into a brief, informative summary that captures the key points.

    ## **STRICT CONTENT ACCURACY RULES:**
    1. **Use Only the Given Blog Content**  
       - The summary **must strictly adhere** to the information provided in the blog post.
       - You **must not introduce new facts, assumptions, or information** that are not in the original blog post.
       - Focus on the main arguments, key points, and conclusions from the original content.

    2. **Maintain Accuracy While Being Concise**  
       - Keep the same perspective and factual accuracy as the original blog post.
       - Preserve key technical terminology while making the content more concise.

    3. **Summary Structure:**  
       - Begin with a one-sentence overview of the blog post's main topic.
       - Include 3-5 key points from the original content.
       - End with the main conclusion or takeaway from the blog post.
       - Keep the total length between 150-300 words.
       
    4. **Format:**
       - Use Markdown formatting for the summary.
       - Make the content easily scannable with bold key points.
       - Include a brief title at the beginning.
  `;

  const USER_PROMPT = `
    Create a concise summary of the following blog post:

    ${blogContent}
  `;

  const messages: GPTPrompt[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: USER_PROMPT },
  ];

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    messages,
    maxTokens: 500,
    temperature: 0.4,
  });

  return result.text;
}

"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { GPTPrompt } from "../types/gpt.types";

export async function parseSubjectMatter(subject: string) {
  const SYSTEM_PROMPT = `Your role is to help out distill a  user input into a more specific and actionable topic that will be used to generate either a blog post or a newsletter.
    Parse through the user input and narrow input down to a specific topic/field of interest.

    IMPORTANT: Check for the language used in the user input keep the output in the same language. The only viable options are English and Portuguese from Portugal. If there is a mix of languages, write the output in Portuguese from Portugal. Do not add any other language to the output and do not accept input in any other languages.
    `;

  const USER_PROMPT = `User Input: ${subject}`;

  const ASSISTANT_EXAMPLE = ` 
    EXAMPLE 1: 
        -Input: "Write a blog post about the latest trends in the insurance industry"
        -Output:"Insurance Industry"

    EXAMPLE 2:
        -Input: "Talk about the possible consequences of rapidly evolving AI generated images"
        -Output:"AI/LLM Generated Art"

    EXAMPLE 3:
        -Input: "The impact of misinformation in social media in elections"
        -Output:"Misinformation in Elections"
    `;

  const messages: GPTPrompt[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: USER_PROMPT },
    { role: "assistant", content: ASSISTANT_EXAMPLE },
  ];

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    messages,
    temperature: 0.7,
    maxSteps: 1,
    maxTokens: 100,
  });

  return result.text;
}

"use server";

import tavilySearch from "@/app/lib/search";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function synthesizeQueryFrom(chatContext: string[]) {
  const query = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `
  You are a helpful assistant that will the derive the appropriate search query from the following chat history. 
  Chat History: ${chatContext}
  IMPORTANT: The returned query should be a single sentence and no more than 10 words and should be the query itself nothing else.
  `,
    maxTokens: 100,
    temperature: 0.1,
  });

  console.log("query", query.text);
  return query.text;
}

export async function getSearchResults(query: string) {
  const results = await tavilySearch.search(
    {
      query,
      count: 5,
    },
    {
      searchDepth: "advanced",
      includeImages: false,
      includeRawContent: true,
      maxTokens: 2,
    },
  );
  return results;
}

"use server";

import tavilySearch from "@/app/lib/search";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function synthesizeQueryFrom(
  chatContext: string[],
  currentYear: number,
) {
  const query = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `
  You are a helpful assistant that will the derive the appropriate search query from the following chat history. 
  Chat History: ${chatContext}
  IMPORTANT: 
  1-The returned query should be a single sentence and no more than 10 words and should be the query itself nothing else.
  2-The query should be in the style of a search engine query.
  3- If there is a need to add a date to the query use this value: ${currentYear}
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

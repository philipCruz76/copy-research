import { getVectorDb } from "@/app/lib/ai/store";
import { createDataStreamResponse, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { extractTextFromMessage } from "@/app/lib/utils";
import { SYSTEM_PROMPT, USER_PROMPT } from "@/app/lib/ai/templates";
import { getSearchResults } from "@/app/lib/actions/search-actions";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();


  try {
    let userQuestion = "";

    if (Array.isArray(messages) && messages.length > 0) {
      // Find the last user message in the array
      for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];
        if (message.role === "user") {
          userQuestion = extractTextFromMessage(message);
          if (userQuestion) break;
        }
      }
    } else if (typeof messages === "string") {
      // Fallback in case messages is directly a string
      userQuestion = messages;
    }

    // If we couldn't extract a question, return an error
    if (!userQuestion || userQuestion.trim() === "") {
      return new Response("No valid question found in the request", {
        status: 400,
      });
    }

    console.log("User question:", userQuestion);

    const vectorDb = await getVectorDb("url-document");

    // Use the actual user question for the vector search with more results
    // and a higher similarity threshold to ensure relevance
    const results = await vectorDb.similaritySearch(userQuestion, 4);

    // Filter out any context that's too short to be useful and join the rest
    const userContext = results
      .map((result) => result.pageContent)
      .filter((content) => content.length > 20) // Filter out very short snippets
      .join("\n\n"); // Add extra line breaks for better separation

    // If no relevant context was found
    if (!userContext || userContext.trim().length === 0) {
      
      const response = createDataStreamResponse({
        execute(dataStream) {
          dataStream.writeData({
            text: `Lamento, não tenho informação suficiente para responder a esta pergunta: "${userQuestion}"`,
          });
        },
      });
      return response;
    }

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: USER_PROMPT(userQuestion, userContext),
        },
      ],
      tools: {
        search: {
          description: "Search the web for information not available in the provided context",
          parameters: z.object({
            query: z.string().describe("The search query to find relevant information"),
          }),
          execute: async ({ query }) => {
            const searchResults = await getSearchResults(query);
            // Format search results for the model to use
            const formattedResults = searchResults.pages.map((page) => 
              `Source: ${page.title || 'Web Search'}\n${page.content}`
            ).join("\n\n");
            
            // Return formatted results with instructions to answer in Portuguese
            return `${formattedResults}\n\nWith this information, please provide a final answer to the user's question in Portuguese.`;
          },
        },
      },
      toolChoice: 'auto',
      maxSteps: 2, // Limit to prevent search loops - just one tool use and then final answer
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Error loading documents", { status: 500 });
  }
}

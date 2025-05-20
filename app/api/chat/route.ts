import { getVectorDb, getCachedDocument } from "@/app/lib/ai/store";
import {
  appendClientMessage,
  appendResponseMessages,
  createDataStreamResponse,
  streamText,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { extractTextFromMessage } from "@/app/lib/utils";
import { SYSTEM_PROMPT, USER_PROMPT } from "@/app/lib/ai/templates";
import {
  getSearchResults,
  synthesizeQueryFrom,
} from "@/app/lib/actions/search-actions";
import { z } from "zod";
import db from "@/app/lib/db";
import { loadChat } from "@/app/lib/ai/loadChat";
import { ChatMessage } from "@/app/lib/types/gpt.types";
import { NextResponse } from "next/server";
import { FollowUpResult, isFollowUpQuery } from "@/app/lib/ai/isFollowUpQuery";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { message, id } = await req.json();

  try {
    let userQuestion = "";
    let isFollowUp: FollowUpResult = {
      isFollowUp: false,
      confidence: 0,
      reason: "",
    };
    let userContext = "";

    // Check if conversation exists, create it if it doesn't
    let conversation = await db.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      conversation = await db.conversation.create({
        data: { id },
      });
    }

    // Save the user message to the database
    await db.message.create({
      data: {
        role: message.role,
        content: message.content,
        conversationId: id,
      },
    });

    // load the previous messages from the server:
    const previousMessages = (await loadChat(id)).messages as ChatMessage[];

    // append the new message to the previous messages:
    const messages = appendClientMessage({
      messages: previousMessages,
      message,
    });

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

    if (messages.length > 2) {
      isFollowUp = await isFollowUpQuery(userQuestion, previousMessages);
    }

    if (isFollowUp.isFollowUp) {
      console.log("Detected Follow-up question.");
      console.log("Confidence level: ", isFollowUp.confidence);

      const cachedDocument = await getCachedDocument(
        conversation.lastDocumentId!,
      );
      if (!cachedDocument) {
        console.log("No cached document found.");
      }
      userContext = cachedDocument?.documentData[0].data!;
    }

    if (!isFollowUp.isFollowUp) {
      const vectorDb = await getVectorDb();

      // Use the actual user question for the vector search with more results
      // and a higher similarity threshold to ensure relevance
      const results = await vectorDb.similaritySearchWithScore(userQuestion, 5);

      results.map((result) => {
        if (result[1] < 0.3) {
          return null;
        }
        return result[0].pageContent;
      });

      // Retrieve the full document from the database or from the cache:
      const documentId = results[0][0].metadata.documentId;
      const document = await getCachedDocument(documentId);

      await db.conversation.update({
        where: { id },
        data: {
          lastDocumentId: documentId,
        },
      });

      if (!document) {
        return NextResponse.json(
          {
            error: "Document not found",
          },
          { status: 404 },
        );
      }

      // Filter out any context that's too short to be useful and join the rest
      userContext = results
        .map((result) => result[0].pageContent)
        .filter((content) => content.length > 20) // Filter out very short snippets
        .join("\n\n"); // Add extra line breaks for better separation

      // If no relevant context was found
      if (!userContext || userContext.trim().length === 0) {
        const noContextResponse = `Lamento, não tenho informação suficiente para responder a esta pergunta: "${userQuestion}"`;

        // Save the assistant message to the database
        await db.message.create({
          data: {
            role: "assistant",
            content: noContextResponse,
            conversationId: id,
          },
        });

        const response = createDataStreamResponse({
          execute(dataStream) {
            dataStream.writeData({
              text: noContextResponse,
            });
          },
        });
        return response;
      }
    }

    if (userContext === "") {
      throw new Error("No user context found. Check implementation.");
    }
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      temperature: 0.2,
      system: SYSTEM_PROMPT(new Date().getFullYear()),
      messages: [
        {
          role: "user",
          content: USER_PROMPT(userQuestion, userContext),
        },
      ],
      async onFinish({ response }) {
        const streamedMessages = appendResponseMessages({
          messages,
          responseMessages: response.messages,
        });

        // Only save the latest assistant response to the database
        const assistantMessages = streamedMessages.filter(
          (msg) => msg.role === "assistant",
        );

        if (assistantMessages.length > 0) {
          const latestAssistantMessage =
            assistantMessages[assistantMessages.length - 1];

          await db.message.create({
            data: {
              role: latestAssistantMessage.role,
              content: latestAssistantMessage.content as string,
              conversationId: id,
            },
          });
        }

        // Update conversation updatedAt
        await db.conversation.update({
          where: { id },
          data: { updatedAt: new Date() },
        });
      },
      tools: {
        search: {
          description:
            "Search the web for information not available in the provided context",
          parameters: z.object({
            chatContext: z.array(z.string()).describe("The chat history"),
          }),
          execute: async ({ chatContext }) => {
            const chatContextArray = messages.map((message: any) => {
              if (typeof message.content === "string") {
                return message.content;
              }
            });
            // Direct string content
            const query = await synthesizeQueryFrom(
              chatContextArray,
              new Date().getFullYear(),
            );
            const searchResults = await getSearchResults(query);
            // Format search results for the model to use
            const formattedResults = searchResults.pages
              .map(
                (page) =>
                  `Source: ${page.title || "Web Search"}\n${page.content}`,
              )
              .join("\n\n");

            // Record the search action in the database
            await db.message.create({
              data: {
                role: "system",
                content: `Search executed: ${query}`,
                conversationId: id,
              },
            });

            const isPortuguese =
              userQuestion.match(/[áàâãéèêíïóôõöúüçÁÀÂÃÉÈÊÍÏÓÔÕÖÚÜÇ]/) !== null;
            if (isPortuguese) {
              return `${formattedResults}\n\nCom esta informação, por favor forneça uma resposta final à pergunta do utilizador em Português.`;
            } else {
              return `${formattedResults}\n\nWith this information, please provide a final answer to the user's question in English.`;
            }
          },
        },
      },
      toolChoice: "auto",
      maxSteps: 2, // Limit to prevent search loops - just one tool use and then final answer
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Error processing request", { status: 500 });
  }
}

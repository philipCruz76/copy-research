import { getVectorDb, getCachedDocument } from "@/app/lib/ai/store";
import {
  AssistantModelMessage,
  createTextStreamResponse,
  Output,
  stepCountIs,
  streamText,
  TextPart,
  ToolModelMessage,
  UIDataTypes,
  UIMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { SYSTEM_PROMPT, USER_PROMPT } from "@/app/lib/ai/templates";
import { z } from "zod";
import db from "@/app/lib/db";
import { loadChat } from "@/app/lib/ai/loadChat";
import { DocumentChunk, responseSchema } from "@/app/lib/types/gpt.types";
import { NextResponse } from "next/server";
import { FollowUpResult, isFollowUpQuery } from "@/app/lib/ai/isFollowUpQuery";
import { Conversation } from "@prisma/client";
import { CitedResponse } from "@/app/lib/types/citations.types";
import {
  getSearchResults,
  synthesizeQueryFrom,
} from "@/app/lib/actions/search-actions";
import { PageResult } from "@/app/lib/search/index";
import { auth } from "@/app/lib/auth";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export type StreamingToolCallResult = UIMessage<
  never,
  UIDataTypes,
  {
    runOnlineSearch: {
      input: {
        chatContext: string;
      };
      output: CitedResponse;
    };
  }
>;
export async function POST(req: Request) {
  const { message, id }: { message: UIMessage; id: string } = await req.json();
  try {
    const session = await auth();
    if (message.role !== "user") {
      return new Response("Invalid message role", {
        status: 400,
      });
    }
    let userQuestion = "";
    let isFollowUp: FollowUpResult = {
      isFollowUp: false,
      confidence: 0,
      reason: "",
    };
    let userContext: DocumentChunk[] = [];
    let conversation: Conversation | null = null;

    // Check if conversation exists, create it if it doesn't
    conversation = await db.conversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      conversation = await db.conversation.create({
        data: { id, userId: session?.user.id! },
      });
    }

    // Save the user message to the database
    await db.message.create({
      data: {
        role: message.role,
        content: message.parts.map((p: any) => p.text).join(" "),
        conversationId: id,
      },
    });

    // load the previous messages from the server:
    const previousMessages: UIMessage[] = (await loadChat(id)).messages.map(
      (m) => ({
        id: m.id,
        role: m.role as "system" | "user" | "assistant",
        parts: [
          {
            type: "text",
            text: m.content,
          },
        ],
      }),
    );

    // append the new message to the previous messages:
    const messages = [...previousMessages, message];

    if (Array.isArray(messages) && messages.length > 0) {
      // Find the last user message in the array
      for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];
        if (message.role === "user") {
          userQuestion = message.parts.map((p: any) => p.text).join(" ");
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
      const cachedDocument = await getCachedDocument(
        conversation.lastDocumentId!,
      );
      if (!cachedDocument) {
        console.log("No cached document found.");
        return NextResponse.json(
          {
            error: "Document not found",
          },
          { status: 404 },
        );
      }
      userContext = cachedDocument.chunks.map((chunk) => ({
        content: chunk.content,
        chunkId: chunk.vectorId,
      }));
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
        .map((result) => {
          return {
            content: result[0].pageContent,
            chunkId: result[0].metadata.id,
          };
        })
        .filter((chunk) => chunk.content.length > 20); // Filter out very short snippets

      // If no relevant context was found
      if (!userContext || userContext.length === 0) {
        const noContextResponse = `Lamento, não tenho informação suficiente para responder a esta pergunta: "${userQuestion}"`;

        // Save the assistant message to the database
        await db.message.create({
          data: {
            role: "assistant",
            content: noContextResponse,
            conversationId: id,
          },
        });

        const response = createTextStreamResponse({
          textStream: new ReadableStream({
            start(controller) {
              controller.enqueue(noContextResponse);
              controller.close();
            },
          }),
        });
        return response;
      }
    }

    if (userContext.length === 0) {
      throw new Error("No user context found. Check implementation.");
    }
    const result = await streamText({
      model: openai("gpt-4.1-nano"),
      temperature: 0.1,
      system: SYSTEM_PROMPT(new Date().getFullYear(), userContext),
      stopWhen: stepCountIs(3), // Should be 2 steps: 1 tool call and 1 final answer
      activeTools: ["runOnlineSearch"],
      maxOutputTokens: 1000,
      messages: [
        {
          role: "user",
          content: USER_PROMPT(userQuestion, new Date().getFullYear()),
        },
      ],
      async onFinish({ response }) {
        const assistantMessages = response.messages.map(
          (m: AssistantModelMessage | ToolModelMessage) => {
            if (m.role === "assistant") {
              return {
                role: m.role,
                content: m.content[0] as TextPart,
              };
            }
          },
        );

        if (assistantMessages.length > 0) {
          const latestAssistantMessage =
            assistantMessages[assistantMessages.length - 1];

          if (!latestAssistantMessage) {
            throw new Error("No assistant message found");
          }

          await db.message.create({
            data: {
              role: latestAssistantMessage.role as "assistant",
              content: latestAssistantMessage.content.text,
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
      experimental_output: Output.object({
        schema: responseSchema,
      }),
      tools: {
        runOnlineSearch: {
          inputSchema: z.object({
            chatContext: z.string(),
          }),
          description:
            "Search the web for information not available in the provided context",
          async execute({ chatContext }) {
            const query = await synthesizeQueryFrom(
              messages[messages.length - 1].parts
                .map((p: any) => p.text)
                .join(" "),
              new Date().getFullYear(),
            );
            const searchResults = await getSearchResults(query);
            // Format search results for the model to use
            const formattedResults = searchResults.pages;
            // Record the search action in the database
            await db.message.create({
              data: {
                role: "assistant",
                content: `Search executed: ${query} \n\n ${searchResults.pages.map((result: PageResult) => `{ "title": "${result.title}", "url": "${result.url}", "favicon": "${result.favicon}"}`).join(",")}`,
                conversationId: id,
              },
            });

            return `With the following results from the search tool, please answer the user's question. Remember to use the URL from the results to formulate the citations.
                User question: ${userQuestion}
                Search results:
                ${formattedResults.map((result: PageResult) => `Title: ${result.title}\nURL: ${result.url}\nContent: ${result.content}`).join("\n\n")}`;
          },
        },
      },
      toolChoice: "auto",
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
    });
  } catch (error) {
    console.error(error);
    return new Response("Error processing request", { status: 500 });
  }
}

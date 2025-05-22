import { Conversation } from "@prisma/client";
import { z } from "zod";

export type GPTPrompt = {
  role: "system" | "user" | "assistant" | "data";
  content: string;
};
export type ChatMessage = {
  id: string;
  conversationId?: string;
  createdAt?: Date;
  role: "system" | "user" | "assistant" | "data";
  content: string;
};

export type FullConversation = Conversation & {
  messages: ChatMessage[];
};

export type TopicContext = {
  id: string;
  topic: string;
  relevantDocuments: any[];
  lastAccessed: Date;
};

export type DocumentChunk = {
  content: string;
  chunkId: string;
};

export const responseSchema = z.object({
  answer: z.string().describe("The complete answer to the user's question"),
  citations: z.array(
    z.object({
      chunkId: z.string().describe("The ID of the chunk being cited"),
      relevantText: z
        .string()
        .describe(
          "The specific text from the chunk that supports this part of the answer",
        ),
      position: z
        .number()
        .describe(
          "Character position in the answer where this citation starts",
        ),
    }),
  ),
});

export type GptResponse = z.infer<typeof responseSchema>;

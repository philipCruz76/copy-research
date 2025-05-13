import { Conversation } from "@prisma/client";


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

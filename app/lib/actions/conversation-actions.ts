"use server";

import db from "@/app/lib/db";
import { ChatMessage, FullConversation } from "../types/gpt.types";

/**
 * Creates a new conversation with it's initial message and redirects to its chat page
 */
export async function createNewConversation(initialMessage: ChatMessage) {
  try {
    // Create a new conversation in the database
    const conversation = await db.conversation.create({
      data: {
        userId: null, // Can be updated later if user authentication is implemented
        messages: {
          create: {
            id: initialMessage.id,
            createdAt: initialMessage.createdAt,
            role: initialMessage.role as string,
            content: initialMessage.content,
          },
        },
      },
    });

    // Return the conversation ID
    return { id: conversation.id, success: true };
  } catch (error) {
    console.error("Error creating conversation:", error);
    return { error: "Failed to create conversation", success: false };
  }
}

/**
 * Deletes a conversation by ID
 */
export async function deleteConversation(conversationId: string) {
  try {
    await db.conversation.delete({
      where: {
        id: conversationId,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return { error: "Failed to delete conversation", success: false };
  }
}

/**
 * Retrieves all conversations
 */
export async function getConversations() {
  try {
    const conversations = await db.conversation.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        messages: true,
      },
    });

    return conversations as FullConversation[];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw new Error("Failed to fetch conversations");
  }
}

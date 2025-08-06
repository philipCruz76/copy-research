"use server";

import db from "@/app/lib/db";
import { FullConversation } from "@/app/lib/types/gpt.types";
import { auth } from "@/app/lib/auth";

/**
 * Creates a new conversation with it's initial message and redirects to its chat page
 */
export async function createNewConversation(chatId: string) {
  try {
    const session = await auth();
    // Create a new conversation in the database
    const conversation = await db.conversation.create({
      data: {
        userId: session?.user.id!, // Can be updated later if user authentication is implemented
        id: chatId,
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
    const session = await auth();

    // Guard clause: if user is not authenticated, return empty array
    if (!session?.user?.id) {
      console.log("No authenticated user, returning empty conversations");
      return [];
    }

    const conversations = await db.conversation.findMany({
      where: {
        userId: session.user.id, // Now we know this is defined
      },
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

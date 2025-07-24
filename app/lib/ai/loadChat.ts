"use server";

import db from "@/app/lib/db";
import { auth } from "../auth";

export async function loadChat(id: string) {
  try {
    const session = await auth();

    // Guard clause: if user is not authenticated, throw error
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id,
        userId: session.user.id, // Now we know this is defined
      },
      include: {
        messages: true,
      },
    });

    if (!conversation) throw new Error("Conversation not found");

    return conversation;
  } catch (error) {
    throw new Error("Failed to load chat with id: " + id);
  }
}

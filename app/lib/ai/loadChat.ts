"use server";

import db from "../db";

export async function loadChat(id: string) {
  try {
    const conversation = await db.conversation.findUnique({
      where: {
        id,
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

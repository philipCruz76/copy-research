import { useState } from "react";
import { useConversationStore } from "@/app/lib/stores/conversation-store";
import { UIMessage } from "ai";

export function useTopicDetection() {
  const [topic, setTopic] = useState<string | null>(null);
  const {
    conversations,
    setConversations,
    setCurrentConversationId,
    updateConversation,
  } = useConversationStore();
  const [isLoading, setIsLoading] = useState(false);

  async function detectTopic(messages: UIMessage[], id?: string) {
    if (!messages.length) return;

    try {
      setIsLoading(true);
      const res = await fetch("/api/topic-extraction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, id }),
      });

      if (!res.ok) {
        throw new Error("Failed to detect topic");
      }

      const data = await res.json();
      setTopic(data.mainTopic);
      setCurrentConversationId(data.conversation.id);

      // Find if this conversation already exists in the store
      const conversationExists = conversations.some(
        (conv) => conv.id === data.conversation.id,
      );

      if (conversationExists) {
        // Update existing conversation instead of adding a new one
        updateConversation(data.conversation.id, {
          title: data.conversation.title,
        });
      } else {
        // Add new conversation
        setConversations([data.conversation, ...conversations]);
      }
      return data.conversation.id;
    } catch (error) {
      console.error("Error detecting topic:", error);
      setTopic(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { topic, detectTopic, isLoading };
}

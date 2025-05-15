import { useState } from "react";
import { ChatMessage } from "@/app/lib/types/gpt.types";
import { useConversationStore } from "@/app/lib/stores/conversation-store";

export function useTopicDetection() {
  const [topic, setTopic] = useState<string | null>(null);
  const { conversations, setConversations } = useConversationStore();
  const [isLoading, setIsLoading] = useState(false);

  async function detectTopic(messages: ChatMessage[], id: string) {
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
      const updatedConversations = [data.conversation, ...conversations];
      setConversations(updatedConversations);
      return data.mainTopic;
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

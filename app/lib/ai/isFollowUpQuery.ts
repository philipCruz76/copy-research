import { ChatMessage } from "@/app/lib/types/gpt.types";
import { embeddings } from "@/app/lib/ai/gpt";
import similarity from "compute-cosine-similarity";

const followUpIndicators = [
  // existing
  "more",
  "further",
  "also",
  "additional",
  "elaborate",
  "continue",
  "else",
  "another",
  "other",
  "next",
  // new expansions
  "about",
  "anymore",
  "besides",
  "actually",
  "okay",
  "sure",
  "understood",
  "right",
  "what about",
  "how about",
  "anything about",
];

const singleWordFollowUps = [
  "it",
  "that",
  "which",
  "how",
  "why",
  "where",
  "and",
  "so",
  "but",
  "ok",
  "okay",
  "right",
];

export async function isFollowUpQuery(
  query: string,
  recentMessages: ChatMessage[],
): Promise<boolean> {
  const text = query.trim().toLowerCase();
  const wordCount = query.trim().split(/\s+/).length;

  // 1) Too short? single-word deictic
  const words = text.split(/\s+/);
  if (words.length === 1 && singleWordFollowUps.includes(words[0])) {
    return true;
  }

  // 2) Contains any multi-word indicator
  if (wordCount < 8 && followUpIndicators.some((ind) => text.includes(ind))) {
    return true;
  }

  // 3) Embedding similarity against recent messages
  if (recentMessages.length > 0) {
    const lastMessage = recentMessages[recentMessages.length - 1].content;

    const [embedQuery, embedLastMessage] = await Promise.all([
      embeddings.embedQuery(query),
      embeddings.embedQuery(lastMessage),
    ]);

    const sim = similarity(embedQuery, embedLastMessage);
    if (sim && sim > 0.7) {
      return true;
    }
  }

  return false;
}

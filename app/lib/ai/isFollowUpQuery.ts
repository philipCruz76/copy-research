import { ChatMessage } from "@/app/lib/types/gpt.types";
import { embeddings } from "@/app/lib/ai/gpt";
import similarity from "compute-cosine-similarity";

// Stronger follow-up indicators (less ambiguous)
const strongFollowUpIndicators = [
  "more about this",
  "tell me more",
  "elaborate on that",
  "continue explaining",
  "following up",
  "regarding this",
  "on this topic",
  "in relation to that",
];

// Moderate indicators (potentially ambiguous)
const moderateFollowUpIndicators = [
  "more",
  "further",
  "also",
  "additional",
  "elaborate",
  "continue",
  "else",
  "another",
  "next",
];

// Weak indicators (very ambiguous, need additional evidence)
const weakFollowUpIndicators = [
  "about",
  "how",
  "why",
  "what",
  "which",
  "okay",
  "sure",
  "understood",
  "right",
];

const singleWordFollowUps = ["it", "that", "this", "these", "those"];

export type FollowUpResult = {
  isFollowUp: boolean;
  confidence: number; // 0 to 1
  reason: string;
};

export async function isFollowUpQuery(
  query: string,
  recentMessages: ChatMessage[],
): Promise<FollowUpResult> {
  const text = query.trim().toLowerCase();
  const words = text.split(/\s+/);
  const wordCount = words.length;

  let evidence = 0;
  let reason = "";

  // 1) Single-word pronouns are strong follow-up indicators
  if (words.length === 1 && singleWordFollowUps.includes(words[0])) {
    return {
      isFollowUp: true,
      confidence: 0.95,
      reason: "Single deictic pronoun",
    };
  }

  // 2) Check for strong follow-up phrases (highest confidence)
  for (const phrase of strongFollowUpIndicators) {
    if (text.includes(phrase)) {
      evidence += 0.8;
      reason = "Strong follow-up indicator";
      break;
    }
  }

  // 3) Check for moderate indicators
  if (evidence < 0.8) {
    for (const word of moderateFollowUpIndicators) {
      if (text.includes(word)) {
        evidence += 0.4;
        reason = reason || "Moderate follow-up indicator";
        break;
      }
    }
  }

  // 4) Check for weak indicators, but only if query is short
  if (evidence < 0.8 && wordCount < 6) {
    for (const word of weakFollowUpIndicators) {
      if (text.includes(word)) {
        evidence += 0.2;
        reason = reason || "Weak follow-up indicator in short query";
        break;
      }
    }
  }

  // 5) Embedding similarity analysis
  if (recentMessages.length > 0) {
    // Get query embedding
    const queryEmbedding = await embeddings.embedQuery(query);

    // Compare with last message
    const lastMessage = recentMessages[recentMessages.length - 1].content;
    const lastMessageEmbedding = await embeddings.embedQuery(lastMessage);
    const messageSimScore =
      similarity(queryEmbedding, lastMessageEmbedding) || 0;

    // Strong similarity to last message
    if (messageSimScore > 0.8) {
      evidence += 0.6;
      reason = "High similarity to last message";
    }
    // Moderate similarity to last message
    else if (messageSimScore > 0.7) {
      evidence += 0.3;
      reason = reason || "Moderate similarity to last message";
    }
  }

  // Calculate final confidence based on accumulated evidence
  const confidence = Math.min(1, Math.max(0, evidence));

  return {
    isFollowUp: confidence > 0.6, // Decision threshold
    confidence,
    reason: reason || "Insufficient follow-up indicators",
  };
}

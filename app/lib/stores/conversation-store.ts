import { create } from "zustand";
import { produce } from "immer";
import {
  ChatMessage,
  FullConversation,
  TopicContext,
} from "@/app/lib/types/gpt.types";

type ConversationState = {
  conversations: FullConversation[];
  messages: ChatMessage[];
  currentTopicId: string | null;
  topicContexts: Record<string, TopicContext>;
  isLoadingConversations: boolean;
  setConversations: (conversations: FullConversation[]) => void;
  setMessages: (message: ChatMessage) => void;
  setCurrentTopic: (topicId: string | null) => void;
  updateTopicContext: (topicId: string, context: Partial<TopicContext>) => void;
  clearMessages: () => void;
  setIsLoadingConversations: (isLoadingConversations: boolean) => void;
};

export const useConversationStore = create<ConversationState>()((set) => ({
  conversations: [],
  messages: [],
  currentTopicId: null,
  topicContexts: {},
  isLoadingConversations: true,

  setConversations: (conversations: FullConversation[]) =>
    set({ conversations }),
  setMessages: (message: ChatMessage) =>
    set(
      produce((get) => {
        get().messages.push({
          id: message.id,
          content: message.content,
          role: message.role,
          createdAt: message.createdAt,
        });
      }),
    ),
  setCurrentTopic: (topicId) => set({ currentTopicId: topicId }),
  updateTopicContext: (topicId, partialContext) =>
    set((state) => {
      const existingContext = state.topicContexts[topicId] || {
        id: topicId,
        topic: "",
        relevantDocuments: [],
        lastAccessed: new Date(),
      };

      return {
        topicContexts: {
          ...state.topicContexts,
          [topicId]: {
            ...existingContext,
            ...partialContext,
            lastAccessed: new Date(),
          },
        },
      };
    }),
  clearMessages: () => set({ messages: [] }),
  setIsLoadingConversations: (isLoadingConversations: boolean) =>
    set({ isLoadingConversations }),
}));

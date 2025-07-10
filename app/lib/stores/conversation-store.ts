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
  currentConversationId: string | null;
  topicContexts: Record<string, TopicContext>;
  isLoadingConversations: boolean;
  setConversations: (conversations: FullConversation[]) => void;
  setMessages: (message: ChatMessage) => void;
  setCurrentConversationId: (conversationId: string | null) => void;
  updateConversation: (
    conversationID: string,
    partialConversation: Partial<FullConversation>,
  ) => void;
  updateTopicContext: (topicId: string, context: Partial<TopicContext>) => void;
  clearMessages: () => void;
  setIsLoadingConversations: (isLoadingConversations: boolean) => void;
};

export const useConversationStore = create<ConversationState>()((set) => ({
  conversations: [],
  messages: [],
  currentConversationId: null,
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
  setCurrentConversationId: (conversationId) =>
    set({ currentConversationId: conversationId }),
  updateConversation: (conversationID, partialConversation) =>
    set((state) => {
      const existingConversation = state.conversations.find(
        (conv) => conv.id === conversationID,
      );
      if (existingConversation) {
        return {
          conversations: state.conversations.map((conv) =>
            conv.id === conversationID
              ? { ...conv, ...partialConversation }
              : conv,
          ),
        };
      }
      return state;
    }),
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

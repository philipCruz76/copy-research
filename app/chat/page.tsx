"use client";

import { useChat } from "@ai-sdk/react";
import { ChatInput } from "@/app/components/chat/ChatInput";
import { useEffect, useRef, useState } from "react";
import { DefaultChatTransport } from "ai";
import { useConversationStore } from "@/app/lib/stores/conversation-store";
import { ChatLoadingPage } from "@/app/components/chat/ChatLoadingPage";
import { toast } from "sonner";
import { useCitationsSidebarStore } from "@/app/lib/stores/citations-sidebar-store";
import { CitedResponse } from "@/app/lib/types/citations.types";
import CitationSidebar from "@/app/components/chat/CitationSidebar";
import DocumentChunkCitations from "@/app/components/chat/DocumentChunkCitations";
import SearchResultCitations from "@/app/components/chat/SearchResultCtiations";

export default function ChatPage() {
  const { conversations, isLoadingConversations } = useConversationStore();
  const [conversationsLoaded, setConversationsLoaded] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const { isOpen } = useCitationsSidebarStore();

  const { messages, sendMessage, status, stop, setMessages, id } = useChat({
    maxSteps: 3,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages }) {
        const chatID = id as string;
        const conversationId =
          useConversationStore.getState().currentConversationId !== null
            ? useConversationStore.getState().currentConversationId
            : chatID;
        return {
          body: { message: messages[messages.length - 1], id: conversationId },
        };
      },
    }),
    onError: (error) => {
      toast.error(
        error.message ||
          "An error occurred while processing your request. Please try again.",
      );
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const extractChunkId = (
    text: string,
  ): { mainText: string; chunkIds: string[] } => {
    const matches = [...text.matchAll(/\[(.*?)\]/g)];
    const ids = matches.flatMap((m) => m[1].split(",").map((id) => id.trim()));
    const mainText = text.slice(0, text.lastIndexOf("[")).trim();
    return { mainText: mainText, chunkIds: ids };
  };

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoadingConversations) {
      setConversationsLoaded(true);
    }
  }, [conversations]);

  useEffect(() => {
    if (status === "streaming" && messages.length > 0) {
      // Get the ID of the most recent assistant message
      const lastAssistantMsgIndex = [...messages]
        .reverse()
        .findIndex((m) => m.role === "assistant");

      if (lastAssistantMsgIndex !== -1) {
        const msgId = messages[messages.length - 1 - lastAssistantMsgIndex].id;
        setStreamingMessageId(msgId);
      }
    } else if (status !== "streaming") {
      // Reset when streaming stops
      setStreamingMessageId(null);
    }
  }, [status, messages]);

  if (!conversationsLoaded) {
    return <ChatLoadingPage />;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white relative">
      {/* Chat header - similar to ChatGPT */}
      <header className="sticky top-0 z-1 flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur p-2 mobile:p-4">
        <h1 className="text-lg font-semibold">Research Assistant</h1>
      </header>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto pb-[180px]">
        <div className="max-w-3xl mx-auto pt-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full mt-12 px-4 text-center">
              <h2 className="text-2xl font-semibold mb-6">
                How can I help you today?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                I'm a research agent that can help you find information and
                parse through information from your own documents or from the
                web.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 px-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} w-full`}
                >
                  <div
                    className={`max-w-[85%] px-[18px] py-[8px]  ${
                      message.role === "user"
                        ? "bg-zinc-700 rounded-3xl min-w-[24px] min-h-[24px] text-gray-100"
                        : " text-black dark:text-white"
                    }`}
                  >
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "step-start":
                          return null;
                        case "reasoning":
                          return (
                            <div
                              key={`${message.id}-reasoning`}
                              className="whitespace-pre-wrap"
                            >
                              THIS IS A REASONING STEP
                              {part.text}
                            </div>
                          );
                        case "text":
                          if (message.role === "assistant") {
                            if (message.id === streamingMessageId) {
                              return (
                                <div
                                  key={`${message.id}-streaming`}
                                  className="whitespace-pre-wrap"
                                >
                                  <div className="animate-pulse italic text-gray-500 dark:text-gray-400">
                                    Generating response...
                                  </div>
                                </div>
                              );
                            }
                            let messageWithCitations: CitedResponse;
                            try {
                              messageWithCitations = JSON.parse(part.text);
                            } catch (e) {
                              toast.error("Error parsing message content");
                              console.error(
                                "Error parsing message content:",
                                e,
                              );
                              return (
                                <div
                                  key={message.id}
                                  className="whitespace-pre-wrap"
                                >
                                  {part.text}
                                </div>
                              );
                            }
                            const result = extractChunkId(
                              messageWithCitations.answer,
                            );

                            return (
                              <div
                                key={message.id}
                                className="whitespace-pre-wrap"
                              >
                                {result.mainText}
                                {result.chunkIds.map((chunkId, index) => {
                                  if (chunkId.startsWith("doc_")) {
                                    return (
                                      <DocumentChunkCitations
                                        key={`${message.id}-${index}-doc`}
                                        index={index}
                                        messageWithCitations={
                                          messageWithCitations
                                        }
                                        chunkId={chunkId}
                                      />
                                    );
                                  } else {
                                    return (
                                      <SearchResultCitations
                                        key={`${message.id}-${index}-search`}
                                        index={index}
                                        source={chunkId}
                                      />
                                    );
                                  }
                                })}
                              </div>
                            );
                          } else {
                            return (
                              <div
                                key={`${message.id}-${i}`}
                                className="whitespace-pre-wrap"
                              >
                                {part.text}
                              </div>
                            );
                          }
                        case "tool-runOnlineSearch":
                          return (
                            <div
                              key={`${message.id}-${i}-toolCall`}
                              className="italic text-gray-500 dark:text-gray-400"
                            >
                              Searching for additional information...
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                </div>
              ))}
              {status === "submitted" && (
                <div
                  key={`message-submitted`}
                  className="animate-pulse text-gray-500 dark:text-gray-400 "
                >
                  Thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      {isOpen && <CitationSidebar />}
      {conversationsLoaded && (
        <div className=" absolute bottom-0 bg-gradient-to-t from-white dark:from-zinc-900 pt-2 w-full z-1">
          <ChatInput
            isLoading={status !== "ready"}
            status={status}
            handleSubmit={(text) => sendMessage({ text })}
            stop={stop}
            messages={messages}
          />
        </div>
      )}
    </div>
  );
}

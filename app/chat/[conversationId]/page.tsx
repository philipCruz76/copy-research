"use client";

import { useChat, useCompletion } from "@ai-sdk/react";
import { ChatInput } from "../../components/chat/ChatInput";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Message } from "ai";
import { useConversationStore } from "@/app/lib/stores/conversation-store";
import { ChatLoadingPage } from "@/app/components/chat/ChatLoadingPage";
import { toast } from "sonner";
import { useCitationsSidebarStore } from "@/app/lib/stores/citations-sidebar-store";
import { Citation, CitedResponse } from "@/app/lib/types/citations.types";
import CitationSidebar from "@/app/components/chat/CitationSidebar";
import { getDocumentByChunkId } from "@/app/lib/actions/getDocumentByChunkId";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { conversations, isLoadingConversations } = useConversationStore();
  const [conversationsLoaded, setConversationsLoaded] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const {
    isOpen,
    citations,
    setIsOpen,
    setCitations,
    setIsLoading,
    setCitedDocument,
  } = useCitationsSidebarStore();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    status,
    id,
    stop,
  } = useChat({
    maxSteps: 5,
    id: conversationId,
    // Only send last message to the server
    experimental_prepareRequestBody({ messages }) {
      return { message: messages[messages.length - 1], id: conversationId };
    },
  });

  const areCitationsEqual = useCallback(
    (citations1: Citation[], citations2: Citation[]) => {
      if (citations1.length !== citations2.length) return false;
      return citations1.every(
        (citation, index) =>
          citation.chunkId === citations2[index].chunkId &&
          citation.relevantText === citations2[index].relevantText &&
          citation.position === citations2[index].position,
      );
    },
    [],
  );

  const retriveCitationInfo = async (chunkId: string) => {
    try {
      setIsLoading(true);

      const document = await getDocumentByChunkId(chunkId);
      if (!document) {
        toast.error("Document not found");
        return;
      }
      setCitedDocument(document);

      setIsLoading(false);
    } catch (error) {
      console.error("Error retriving citation info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load existing messages when the component mounts
  useEffect(() => {
    if (conversationId) {
      try {
        // Find the conversation in the store
        const conversation = conversations.find((c) => c.id === conversationId);

        if (conversation) {
          if (conversation.messages) {
            // Convert database messages to the format expected by useChat
            const formattedMessages = conversation.messages.map((msg) => ({
              id: msg.id,
              role: msg.role as "user" | "assistant" | "system" | "data",
              content: msg.content,
              parts: [{ type: "text", text: msg.content }],
            })) as Message[];

            setMessages(formattedMessages);
          }
        } else {
          console.log("No matching conversation found for ID:", conversationId);
          // Fallback to loadChat if not found in store
          const loadMessages = async () => {
            try {
              const loadedConversation = await import(
                "@/app/lib/ai/loadChat"
              ).then((module) => module.loadChat(conversationId));
              console.log(
                "Loaded conversation from server:",
                loadedConversation,
              );

              if (loadedConversation) {
                const formattedMessages = loadedConversation.messages.map(
                  (msg) => ({
                    id: msg.id,
                    role: msg.role as "user" | "assistant" | "system" | "data",
                    content: msg.content,
                    parts: [{ type: "text", text: msg.content }],
                  }),
                ) as Message[];

                console.log(
                  "Formatted messages from server:",
                  formattedMessages,
                );
                setMessages(formattedMessages);
              }
            } catch (error) {
              console.error("Error loading messages from server:", error);
            }
          };

          loadMessages();
          return; // Skip the remaining code in this branch
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    }
  }, [conversationId, conversations, setMessages]);

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
      <div className="flex-1 overflow-y-auto pb-32">
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
                              // Try to parse if it's a string, otherwise use as is
                              messageWithCitations =
                                typeof message.content === "string"
                                  ? JSON.parse(message.content)
                                  : (message.content as CitedResponse);
                            } catch (e) {
                              console.error(
                                "Error parsing message content:",
                                e,
                              );
                              return (
                                <div
                                  key={message.id}
                                  className="whitespace-pre-wrap"
                                >
                                  {message.content}
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
                                {result.chunkIds.map((chunkId, index) => (
                                  <button
                                    key={`citation-${index}`}
                                    className="p-[2px] rounded-md text-blue-500 hover:text-blue-900 hover:bg-blue-200 ml-2"
                                    onClick={() => {
                                      if (
                                        !areCitationsEqual(
                                          messageWithCitations.citations,
                                          citations,
                                        )
                                      ) {
                                        setCitations(
                                          messageWithCitations.citations,
                                        );
                                        retriveCitationInfo(chunkId);
                                      }
                                      setIsOpen(true);
                                    }}
                                  >
                                    [{index + 1}]
                                  </button>
                                ))}
                              </div>
                            );
                          }
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="whitespace-pre-wrap"
                            >
                              {part.text}
                            </div>
                          );
                        case "tool-invocation":
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
            chatId={id}
            input={input}
            setInput={setInput}
            isLoading={status !== "ready"}
            status={status}
            handleSubmit={handleSubmit}
            stop={stop}
            messages={messages}
          />
        </div>
      )}
    </div>
  );
}

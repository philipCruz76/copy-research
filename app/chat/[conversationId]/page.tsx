"use client";

import { useChat } from "@ai-sdk/react";
import { ChatInput } from "../../components/chat/ChatInput";
import { useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { DefaultChatTransport, UIMessage } from "ai";
import { useConversationStore } from "@/app/lib/stores/conversation-store";
import { ChatLoadingPage } from "@/app/components/chat/ChatLoadingPage";
import { toast } from "sonner";
import { useCitationsSidebarStore } from "@/app/lib/stores/citations-sidebar-store";
import {
  CitedResponse,
  SearchResultInformation,
} from "@/app/lib/types/citations.types";
import CitationSidebar from "@/app/components/chat/CitationSidebar";
import DocumentChunkCitations from "@/app/components/chat/DocumentChunkCitations";
import SearchResultCitations from "@/app/components/chat/SearchResultCtiations";
import { ArrowDown } from "lucide-react";

const extractChunkId = (
  text: string,
): { mainText: string; chunkIds: string[] } => {
  const matches = [...text.matchAll(/\[(.*?)\]/g)];
  const ids = matches.flatMap((m) => m[1].split(",").map((id) => id.trim()));
  const mainText = text.slice(0, text.lastIndexOf("[")).trim();
  return { mainText: mainText, chunkIds: ids };
};

const parseSearchResult = (text: string) => {
  console.log("CALLED PARSE SEARCH RESULT");
  const searchResultString = text.match(/^([^{]*){(.*)/);
  if (!searchResultString) return null;

  try {
    const parsedInfo = JSON.parse("[{" + searchResultString?.[2] + "]" || "[]");
    return {
      prefix: searchResultString[1],
      parsedInfo: parsedInfo,
    };
  } catch (e) {
    console.error("Error parsing search result:", e);
    return null;
  }
};

export default function ChatPage() {
  const params = useParams();
  const windowRef = useRef<Window | null>(null);

  const { conversations, isLoadingConversations, setCurrentConversationId } =
    useConversationStore();

  const conversationId = params.conversationId as string;

  const [conversationsLoaded, setConversationsLoaded] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const [isLastMessageVisible, setIsLastMessageVisible] = useState(true);
  const { isOpen } = useCitationsSidebarStore();
  let searchResultInformation: SearchResultInformation[] | null = null;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    maxSteps: 3,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages }) {
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

  // Sync conversation store with URL params
  useEffect(() => {
    if (conversationId) {
      setCurrentConversationId(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    windowRef.current = window;
  }, []);

  useEffect(() => {
    // Check visibility when messages change
    checkLastMessageVisibility();
  }, [windowRef.current]);

  // Load existing messages when the component mounts
  useEffect(() => {
    if (conversationId) {
      try {
        // Find the conversation in the store
        const conversation = conversations.find((c) => c.id === conversationId);

        if (conversation) {
          if (conversation.messages) {
            // Convert database messages to the format expected by useChat
            const parsedMessages = conversation.messages.map((msg) => ({
              id: msg.id,
              role: msg.role as "user" | "assistant" | "system" | "data",
              parts: [{ type: "text", text: msg.content }],
            })) as UIMessage[];
            setMessages(parsedMessages);
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
                ) as UIMessage[];

                console.log(
                  "Formatted messages from server:",
                  formattedMessages,
                );
                // Fix: Use setMessages instead of setInitialMessages
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

  const renderMessages = useMemo(() => {
    return messages.map((message) => (
      <div
        key={message.id}
        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} w-full`}
      >
        <div
          className={`max-w-[85%] px-[18px] py-[8px]  ${
            message.role === "user"
              ? "bg-gray-300 text-black dark:bg-zinc-700 rounded-3xl min-w-[24px] min-h-[24px] dark:text-gray-100"
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
                  if (part.text.includes("Search executed: ")) {
                    const searchResultString = parseSearchResult(part.text);
                    searchResultInformation =
                      searchResultString?.parsedInfo || null;
                    return (
                      <div
                        key={message.id}
                        className="whitespace-pre-wrap italic text-gray-500 dark:text-gray-400"
                      >
                        {searchResultString?.prefix.trim()}
                      </div>
                    );
                  }
                  let messageWithCitations: CitedResponse;
                  try {
                    if (part.text === "") {
                      return null;
                    }
                    messageWithCitations = JSON.parse(part.text);
                  } catch (e) {
                    toast.error("Error parsing message content");
                    console.error("Error parsing message content:", e);
                    return (
                      <div key={message.id} className="whitespace-pre-wrap">
                        {part.text}
                      </div>
                    );
                  }
                  const result = extractChunkId(messageWithCitations.answer);

                  return (
                    <div key={message.id} className="whitespace-pre-wrap">
                      {result.mainText}
                      {result.chunkIds.map((chunkId, index) => {
                        if (chunkId.startsWith("doc_")) {
                          return (
                            <DocumentChunkCitations
                              key={`${message.id}-${index}-doc`}
                              index={index}
                              messageWithCitations={messageWithCitations}
                              chunkId={chunkId}
                            />
                          );
                        } else {
                          return (
                            <SearchResultCitations
                              key={`${message.id}-${index}-search`}
                              index={index}
                              source={chunkId}
                              searchResultInformation={searchResultInformation}
                              citations={messageWithCitations.citations}
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
    ));
  }, [messages, streamingMessageId, searchResultInformation]);
  const checkLastMessageVisibility = () => {
    if (!messagesEndRef.current || !messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    const lastMessage = messagesEndRef.current;

    const containerRect = container.getBoundingClientRect();
    const lastMessageRect = lastMessage.getBoundingClientRect();

    // Check if the last message is fully visible within the container
    const isVisible =
      lastMessageRect.top >= containerRect.top &&
      lastMessageRect.bottom <= containerRect.bottom;

    setIsLastMessageVisible(isVisible);
  };

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      checkLastMessageVisibility();
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [checkLastMessageVisibility]);

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
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto pb-4">
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
              {renderMessages}
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
        <>
          <div className=" isolate z-10 w-full">
            {!isLastMessageVisible && (
              <button
                className="cursor-pointer absolute z-10 rounded-full bg-clip-padding border bg-white dark:bg-zinc-900 end-1/2 translate-x-1/2 w-8 h-8 flex items-center justify-center bottom-[130px] shadow-lg"
                onClick={() => {
                  messagesEndRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            )}

            <ChatInput
              chatId={conversationId}
              isLoading={status !== "ready"}
              status={status}
              handleSubmit={(text) => sendMessage({ text })}
              stop={stop}
              messages={messages}
            />
          </div>
        </>
      )}
    </div>
  );
}

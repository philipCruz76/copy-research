"use client";

import { useChat } from "@ai-sdk/react";
import { ChatInput } from "../../components/ChatInput";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Message } from "ai";
import { useConversationStore } from "@/app/lib/stores/conversation-store";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const [isLoading, setIsLoading] = useState(true);
  const { conversations } = useConversationStore();

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

  // Load existing messages when the component mounts
  useEffect(() => {
    if (conversationId) {
      try {
        console.log("Current conversations in store:", conversations);
        // Find the conversation in the store instead of loading from server
        const conversation = conversations.find((c) => c.id === conversationId);

        if (conversation) {
          console.log("Found conversation:", conversation);
          // Convert database messages to the format expected by useChat
          const formattedMessages = conversation.messages.map((msg) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant" | "system" | "data",
            content: msg.content,
            parts: [{ type: "text", text: msg.content }],
          })) as Message[];

          console.log("Formatted messages:", formattedMessages);
          setMessages(formattedMessages);
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
            } finally {
              setIsLoading(false);
            }
          };

          loadMessages();
          return; // Skip the remaining code in this branch
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [conversationId, conversations, setMessages]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white relative">
      {/* Chat header - similar to ChatGPT */}
      <header className="sticky top-0 z-1 flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur p-2 mobile:p-4">
        <h1 className="text-lg font-semibold">Research Assistant</h1>
        <button
          onClick={() => setMessages([])}
          className="text-xs px-2 py-1 rounded-md border border-black/10 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Clear Chat
        </button>
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
                              key={`${message.id}-${i}`}
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
                <div className="flex justify-start w-full">
                  <div className="max-w-[85%] px-[18px] py-[8px] text-black dark:text-white">
                    <div className="italic text-gray-500 dark:text-gray-400">
                      Thinking...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Fixed chat input at bottom */}
      <div className="absolute bottom-0 bg-gradient-to-t from-white dark:from-zinc-900 pt-6 w-full z-1">
        <ChatInput
          chatId={id}
          input={input}
          setInput={setInput}
          isLoading={status === "streaming"}
          handleSubmit={handleSubmit}
          stop={stop}
          messages={messages}
        />
      </div>
    </div>
  );
}

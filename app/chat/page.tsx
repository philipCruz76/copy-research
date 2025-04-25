"use client";

import { useChat } from "@ai-sdk/react";
import { ChatInput } from "../components/ChatInput";
import { useEffect, useRef } from "react";

export default function ChatPage() {
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
  } = useChat({
    maxSteps: 5,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white relative">
      {/* Chat header - similar to ChatGPT */}
      <header className="sticky top-0 z-1 flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur p-2 mobile:p-4">
        <h1 className="text-lg font-semibold">Research Assistant</h1>
        <button
          onClick={() => setMessages([])}
          className="text-xs px-2 py-1 rounded-md border border-black/10 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          New Chat
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
                parse through information either on the web or from your own
                documents.
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
              {(status === "submitted") && (
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
      <div className=" absolute bottom-0 bg-gradient-to-t from-white dark:from-zinc-900 pt-6 w-full z-1">
        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={status === "streaming"}
          handleSubmit={handleSubmit}
          stop={stop}
          messages={messages}
          setMessages={setMessages}
          append={append}
        />
      </div>
    </div>
  );
}

"use client";

import { CreateMessage, Message } from "ai";
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  memo,
} from "react";
import { useLocalStorage, useWindowSize } from "usehooks-ts";
import { Textarea } from "../lib/ui/Textarea";
import { cn } from "../lib/utils";
import { toast } from "sonner";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  append: (
    message: Message | CreateMessage,
  ) => Promise<string | null | undefined>;
  handleSubmit: (event?: { preventDefault?: () => void }) => void;
  className?: string;
}

function PureChatInput({
  input,
  setInput,
  isLoading,
  stop,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    "",
  );
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 4000; // Set a reasonable character limit

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight + 2, 200); // Limit max height
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "56px"; // ChatGPT-like initial height
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setInput(value);
    setCharCount(value.length);
    adjustHeight();
  };

  const submitForm = useCallback(() => {
    if (input.trim() === "") return; // Prevent empty submissions

    handleSubmit();
    setLocalStorageInput("");
    resetHeight();
    setCharCount(0);

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [handleSubmit, setLocalStorageInput, width, input]);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  // Update char count when input changes externally
  useEffect(() => {
    setCharCount(input.length);
  }, [input]);

  // Handle window resize to adjust textarea height
  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current) {
        adjustHeight();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 px-4 py-2  desktop:py-4 tablet:py-4 desktop:max-w-3xl mx-auto ">
      <div className="relative flex justify-center w-full bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/20 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <Textarea
          ref={textareaRef}
          placeholder="Message..."
          value={input}
          onChange={handleInput}
          className={cn(
            "min-h-[56px] max-h-[200px] py-3 pl-4 pr-14 w-full overflow-y-auto resize-none rounded-xl !text-base bg-transparent border-0 focus:ring-0 focus-visible:ring-0 dark:bg-transparent",
            className,
            charCount > MAX_CHARS && "border-red-500",
          )}
          rows={1}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();

              if (isLoading) {
                toast.error(
                  "Please wait for the model to finish its response!",
                );
              } else if (input.trim() !== "") {
                submitForm();
              }
            }
          }}
          disabled={isLoading}
        />

        {/* Character counter */}
        <div
          className={cn(
            "absolute bottom-2 left-4 text-xs text-gray-400 dark:text-gray-500",
            charCount > MAX_CHARS && "text-red-500",
          )}
        >
          {charCount > 0 && `${charCount}${MAX_CHARS ? `/${MAX_CHARS}` : ""}`}
        </div>

        {/* Send button */}
        <button
          onClick={() => {
            if (isLoading) {
              stop();
              toast.info("Stopped generation");
            } else if (input.trim() !== "") {
              submitForm();
            }
          }}
          disabled={isLoading && input.trim() === ""}
          className={cn(
            "absolute right-2 bottom-2 p-1.5 rounded-lg transition-colors",
            input.trim() === ""
              ? "text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-70"
              : isLoading
                ? "text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-700"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700",
          )}
          aria-label={isLoading ? "Stop generating" : "Send message"}
          type="button"
        >
          {isLoading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          )}
        </button>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-3 right-10 flex items-center">
            <div className="animate-pulse h-1.5 w-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mr-1"></div>
            <div className="animate-pulse h-1.5 w-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mr-1 animation-delay-200"></div>
            <div className="animate-pulse h-1.5 w-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animation-delay-400"></div>
          </div>
        )}
      </div>

      {/* ChatGPT-like footer */}
      <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2 mb-4">
        <p>
          This model may produce inaccurate information about people, places, or
          facts.
        </p>
      </div>
    </div>
  );
}

export const ChatInput = memo(PureChatInput, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  return true;
});

"use client";

import { MessageSquare } from "lucide-react";

import { Clock } from "lucide-react";
import { FullConversation } from "@/app/lib/types/gpt.types";
import { CitedResponse } from "@/app/lib/types/citations.types";
import Link from "next/link";

type RecentConversationProps = {
  conversation: FullConversation;
};
const RecentConversation = ({ conversation }: RecentConversationProps) => {
  let text = "";
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  if (lastMessage.role === "assistant") {
    try {
      const parsed = JSON.parse(lastMessage.content) as CitedResponse;
      text = parsed.answer;
    } catch (e) {
      console.error("Error parsing message content:", e);
    }
  } else {
    text = lastMessage.content;
  }
  return (
    <div className="bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:scale-105 transition-all duration-300 rounded-lg p-3 border border-gray-200 dark:border-zinc-700 max-w-[95%]">
      <Link
        href={`/chat/${conversation.id}`}
        className="flex justify-between items-start"
      >
        <div className="flex items-start">
          <MessageSquare className="h-4 w-4 mt-1 mr-2 text-gray-500 dark:text-gray-400" />
          <div>
            <h3 className="font-medium">{conversation.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {text.length > 80 ? text.slice(0, 80) + "..." : text}
            </p>
          </div>
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Clock className="h-3 w-3 mr-1" />
          <span>{conversation.updatedAt.toLocaleString()}</span>
        </div>
      </Link>
    </div>
  );
};

export default RecentConversation;

"use client";

import { Conversation } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function ConversationLimitsCard() {
  const { data: conversations, status } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/conversations`,
      );
      const data = (await response.json()) as Conversation[];
      return data;
    },
    refetchInterval: 60 * 3 * 1000, // 3 minutes
  });

  if (status === "pending") {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-20"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-12"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-8"></div>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
            <div className="h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full animate-pulse w-1/3"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-2"></div>
            <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-2"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-black dark:text-white">
            Conversations
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {conversations?.length} of 3 used
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Usage</span>
          <span className="font-medium text-black dark:text-white">
            {conversations?.length}/3
          </span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              (conversations?.length || 0) >= 3
                ? "dark:bg-red-800 bg-red-300"
                : (conversations?.length || 0) >= 2
                  ? "dark:bg-yellow-800 bg-yellow-300"
                  : "dark:bg-green-800 bg-green-300"
            }`}
            style={{ width: `${((conversations?.length || 0) / 3) * 100}%` }}
          />
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 flex justify-between">
          <span>0</span>
          <span>3</span>
        </div>
      </div>
    </div>
  );
}

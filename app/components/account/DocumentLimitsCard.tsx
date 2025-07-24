"use client";

import { Document } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function DocumentLimitsCard() {
  const { data: documents, status: documentsStatus } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/documents`,
      );
      const data = (await response.json()) as Document[];
      return data;
    },
    refetchInterval: 60 * 3 * 1000, // 3 minutes
  });
  if (documentsStatus === "pending") {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-purple-50 dark:bg-purple-800 rounded-lg">
            <svg
              className="w-5 h-5 text-purple-600 dark:text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-24"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-12"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-10"></div>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
            <div className="h-2 bg-zinc-300 dark:bg-zinc-700 rounded-full animate-pulse w-2/5"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-2"></div>
            <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-purple-50 dark:bg-purple-800 rounded-lg">
          <svg
            className="w-5 h-5 text-purple-600 dark:text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-black dark:text-white">Documents</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {documents?.length || 0} of 5 used
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Usage</span>
          <span className="font-medium text-black dark:text-white">
            {documents?.length || 0}/5
          </span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              (documents?.length || 0) >= 5
                ? "bg-red-300 dark:bg-red-800"
                : (documents?.length || 0) >= 4
                  ? "bg-yellow-300 dark:bg-yellow-800"
                  : "bg-green-300 dark:bg-green-800"
            }`}
            style={{ width: `${((documents?.length || 0) / 5) * 100}%` }}
          />
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 flex justify-between">
          <span>0</span>
          <span>5</span>
        </div>
      </div>
    </div>
  );
}

"use client";
import { BarChart, FileText, MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import RecentConversation from "@/app/components/dashboard/RecentConversation";
import { FullConversation } from "@/app/lib/types/gpt.types";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@prisma/client";

export default function DashboardPage() {
  const { data: conversations, status } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/conversations`,
      );
      const data = (await response.json()) as FullConversation[];
      return data;
    },
    refetchInterval: 60 * 3 * 1000, // 3 minutes
  });

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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Overview of your AI assistant
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Documents Card */}

        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700 ">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Documents
            </h2>
            <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{documents?.length || 0}</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {documents?.length || 0 > 1 ? "documents" : "document"}
            </span>
          </div>
          <div className="flex items-end justify-end mt-2">
            <Link
              href="/documents"
              className="text-sm flex w-fit items-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              View all
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Conversations Card */}

        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700 ">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Conversations
            </h2>
            <MessageSquare className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">
              {conversations?.length || 0}
            </span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {conversations?.length || 0 > 1 ? "chats" : "chat"}
            </span>
          </div>
        </div>

        {/* Generated Content Card */}
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700 ">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Generated Content
            </h2>
            <BarChart className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold"> 0</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              posts generated
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Recent Activity</h2>
        </div>

        <div className="flex flex-col gap-3 pl-3">
          {conversations?.length || 0 > 0 ? (
            conversations?.slice(0, 3).map((conversation, index) => (
              <div key={conversation.id}>
                <RecentConversation conversation={conversation} />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No conversations yet. Start your first chat!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/chat"
            className="bg-black dark:bg-white text-white hover:scale-105 transition-all duration-300 dark:text-black rounded-lg p-4 hover:bg-gray-800 dark:hover:bg-gray-200 "
          >
            <h3 className="font-medium mb-1">Start a New Chat</h3>
            <p className="text-sm text-gray-300 dark:text-gray-700">
              Chat with your AI assistant
            </p>
          </Link>

          <Link
            href="/add-documents"
            className="bg-gray-100 dark:bg-zinc-800 hover:scale-105 transition-all duration-300 text-black dark:text-white rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-zinc-700 "
          >
            <h3 className="font-medium mb-1">Upload Documents</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add documents to train your AI
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

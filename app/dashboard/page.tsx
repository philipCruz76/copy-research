"use client";

import {
  BarChart,
  FileText,
  MessageSquare,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { DocumentWithData } from "../lib/types/documentUpload.types";
import useSWR from "swr";
import { getConversations } from "../lib/actions/conversation-actions";
import { FullConversation } from "../lib/types/gpt.types";
import RecentConversation from "../components/dashboard/RecentConversation";
import ConversationSkeleton from "../components/dashboard/ConversationSkeleton";
import StatsCardSkeleton from "../components/dashboard/StatsCardSkeleton";

export default function DashboardPage() {
  const documentsFetcher = useCallback(
    (url: string) => fetch(url).then((res) => res.json()),
    [],
  );
  const conversationsFetcher = useCallback(getConversations, []);
  const {
    data: documents = [],
    isLoading: documentsLoading,
    error,
  } = useSWR<DocumentWithData[]>("/api/documents", documentsFetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 60000, // 1 minute
  });

  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    error: conversationsError,
  } = useSWR<FullConversation[]>("/api/conversations", conversationsFetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 60000, // 1 minute
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
        {documentsLoading ? (
          <StatsCardSkeleton 
            icon={FileText} 
            title="Documents" 
            showViewAll={true} 
            delay={0} 
          />
        ) : (
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Documents
              </h2>
              <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{documents.length}</span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {documents.length > 1 ? "documents" : "document"}
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
        )}

        {/* Conversations Card */}
        {conversationsLoading ? (
          <StatsCardSkeleton 
            icon={MessageSquare} 
            title="Conversations" 
            delay={100} 
          />
        ) : (
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Conversations
              </h2>
              <MessageSquare className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{conversations.length}</span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {conversations.length > 1 ? "chats" : "chat"}
              </span>
            </div>
          </div>
        )}

        {/* Generated Content Card */}
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700 animate-fadeIn" style={{ animationDelay: '200ms' }}>
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
          {conversationsLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <ConversationSkeleton key={index} delay={index * 100} />
            ))
          ) : conversations.length > 0 ? (
            conversations.slice(0, 3).map((conversation, index) => (
              <div
                key={conversation.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
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
            className="bg-black dark:bg-white text-white hover:scale-105 transition-all duration-300 dark:text-black rounded-lg p-4 hover:bg-gray-800 dark:hover:bg-gray-200 animate-fadeIn"
            style={{ animationDelay: '300ms' }}
          >
            <h3 className="font-medium mb-1">Start a New Chat</h3>
            <p className="text-sm text-gray-300 dark:text-gray-700">
              Chat with your AI assistant
            </p>
          </Link>

          <Link
            href="/add-documents"
            className="bg-gray-100 dark:bg-zinc-800 hover:scale-105 transition-all duration-300 text-black dark:text-white rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-zinc-700 animate-fadeIn"
            style={{ animationDelay: '400ms' }}
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

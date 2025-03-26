"use client";

import {
  BarChart,
  FileText,
  MessageSquare,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
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
        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Documents
            </h2>
            <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">0</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              documents
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Conversations
            </h2>
            <MessageSquare className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">3</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              chats
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Usage
            </h2>
            <BarChart className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">25%</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              of free tier
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Recent Activity</h2>
          <Link
            href="/chat-history"
            className="text-sm flex items-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            View all
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-700">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <MessageSquare className="h-4 w-4 mt-1 mr-2 text-gray-500 dark:text-gray-400" />
                <div>
                  <h3 className="font-medium">
                    Copywriting for insurance landing page
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    I need help writing copy for an insurance landing page...
                  </p>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>Today, 2:30 PM</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-700">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <MessageSquare className="h-4 w-4 mt-1 mr-2 text-gray-500 dark:text-gray-400" />
                <div>
                  <h3 className="font-medium">
                    Email campaign for new policy holders
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    Can you help me draft an email campaign for new policy
                    holders?
                  </p>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>Yesterday, 10:15 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/chat"
            className="bg-black dark:bg-white text-white dark:text-black rounded-lg p-4 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            <h3 className="font-medium mb-1">Start a New Chat</h3>
            <p className="text-sm text-gray-300 dark:text-gray-700">
              Chat with your AI assistant
            </p>
          </Link>

          <Link
            href="/add-documents"
            className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
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

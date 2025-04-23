"use client";

import { Monitor, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CopyWritingMobile() {
  return (
    <div className="flex flex-col h-full max-w-[100dvw] bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Copywriting</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          AI-powered copywriting tool
        </p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-2">
          <Monitor className="h-10 w-10 text-gray-600 dark:text-gray-400" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">
            Desktop Experience Required
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
            The copywriting tool is optimized for desktop screens and requires
            more space to work effectively.
          </p>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-left text-gray-600 dark:text-gray-300">
                For the best experience with our AI copywriting tools, please
                switch to a desktop or laptop computer.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors w-full max-w-xs mt-4"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

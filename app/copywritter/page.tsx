"use client";

import { useState } from "react";
import { Copy, Send } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function CopywritterPage() {
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("formal");
  const [copyType, setCopyType] = useState("blog");
  const [output, setOutput] = useState("");

  // Function to copy markdown content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-6">AI Copywriter</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Generate professional-quality copy for your blog posts or newsletters with AI assistance.
      </p>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Subject Input */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-2">
            Subject Matter
          </label>
          <textarea
            id="subject"
            placeholder="Enter the topic or subject matter for your copy..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full min-h-[120px] px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tone Selection */}
          <div>
            <label htmlFor="tone" className="block text-sm font-medium mb-2">
              Tone of Voice
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          {/* Copy Type Selection */}
          <div>
            <label htmlFor="copyType" className="block text-sm font-medium mb-2">
              Copy Type
            </label>
            <select
              id="copyType"
              value={copyType}
              onChange={(e) => setCopyType(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="blog">Blog Post</option>
              <option value="newsletter">Newsletter</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div>
          <button
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            // This is a visual template, so no actual generation functionality
          >
            <Send className="h-4 w-4 mr-2" />
            Generate Copy
          </button>
        </div>

        {/* Output Section */}
        {output ? (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Generated Copy</h2>
              <button
                onClick={copyToClipboard}
                className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <Copy className="h-4 w-4 mr-1.5" />
                Copy Markdown
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700">
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 p-12 border border-dashed border-gray-200 dark:border-zinc-700 rounded-lg flex flex-col items-center justify-center text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-1">
              Your generated copy will appear here
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Enter a subject matter and click "Generate Copy"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

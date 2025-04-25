"use client";
import { useState } from "react";
import { Copy, Send, Loader, CameraIcon } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

type CopyType = "blog" | "newsletter";
type Tone = "formal" | "casual";

export default function CopyWritingDesktop() {
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [copyType, setCopyType] = useState<CopyType>("blog");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleGenerate = async (
    type: CopyType,
    tone: Tone,
    subject: string,
  ) => {
    setIsGenerating(true);
    setCoverImage(null);
    setOutput(""); // Clear previous output when generating new content
    try {
      let res;
      if (type === "blog") {
        res = await fetch("/api/copywrite/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, tone }),
        });
      } else if (type === "newsletter") {
        res = await fetch("/api/copywrite/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, tone }),
        });
      }
      if (!res) {
        throw new Error("Failed to generate copy");
      }
      const result = await res.json();

      setOutput(result.output);
    } catch (error) {
      console.error("Error generating copy:", error);
      toast.error("Failed to generate copy. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async (output: string) => {
    try {
      setIsGeneratingImage(true);
      const res = await fetch("/api/copywrite/image-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogContent: output }),
      });

      const result = await res.json();

      // Create a data URL from the base64 string
      const imageUrl = `data:image/png;base64,${result.output}`;
      setCoverImage(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };
  // Function to copy markdown content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  // Skeleton loading component for the output section
  const SkeletonLoading = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/4 mb-6"></div>
      <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-3"></div>
      <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-5/6 mb-3"></div>
      <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-3"></div>
      <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-4/6 mb-6"></div>

      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-2/6 mb-4"></div>
      <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-3"></div>
      <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-5/6 mb-3"></div>
      <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-3"></div>
    </div>
  );

  // Skeleton loading component for the image
  const ImageSkeletonLoading = () => (
    <div className="animate-pulse mb-6">
      <div className="h-64 bg-gray-200 dark:bg-zinc-700 rounded-lg w-full"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-6">AI Copywriter</h1>
      <h3 className="text-lg font-medium mb-6">Generate professional-quality copy for your blog posts or newsletters
      with AI assistance.</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
      DISCLAIMER: This is a demo and the content generated is not guaranteed to be accurate or appropriate. Content is based solely on the documents uploaded to the tool.
      </p>
      <div className="space-y-6 max-w-4xl mx-auto desktop:min-w-[900px]">
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
            disabled={isGenerating}
            className="w-full min-h-[120px] px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed mobile:text-[16px] mobile:leading-[16px]"
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
              onChange={(e) => {
                const selectedTone = e.target.value as Tone;
                setTone(selectedTone);
              }}
              disabled={isGenerating}
              className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          {/* Copy Type Selection */}
          <div>
            <label
              htmlFor="copyType"
              className="block text-sm font-medium mb-2"
            >
              Copy Type
            </label>
            <select
              id="copyType"
              value={copyType}
              onChange={(e) => {
                const selectedType = e.target.value as CopyType;
                setCopyType(selectedType);
              }}
              disabled={isGenerating}
              className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <option value="blog">Blog Post</option>
              <option value="newsletter">Newsletter</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex items-start justify-between w-full gap-4">
          <button
            onClick={() => {
              if (subject.trim() === "" || subject.length < 10) {
                toast.error(
                  "Subject matter must be at least 10 characters long",
                );
                return;
              } else {
                handleGenerate(copyType, tone, subject);
              }
            }}
            disabled={isGenerating}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed min-w-[160px]"
          >
            {isGenerating ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Generate Copy
              </>
            )}
          </button>

          {/**  Disabled for the time being to save on API costs 

          
          {output.length > 0 ? (<button onClick={()=> {
            handleGenerateImage(output);
          }} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed min-w-[160px]">
            <>
            <CameraIcon className="h-4 w-4 mr-2" />
            Generate Image
            </>
          </button>): null}
          
         */}
        </div>
        {/* Output Section */}
        <div className="mt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">
              {isGenerating ? "Generating Content..." : "Generated Copy"}
            </h2>
            {output && !isGenerating && (
              <button
                onClick={copyToClipboard}
                className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <Copy className="h-4 w-4 mr-1.5" />
                Copy Markdown
              </button>
            )}
          </div>

          {/* Cover Image Display */}
          {isGeneratingImage && <ImageSkeletonLoading />}

          {coverImage && !isGeneratingImage && (
            <div className="mb-6 rounded-lg w-[500px] h-[500px] mx-auto overflow-hidden border border-gray-200 dark:border-zinc-700">
              <Image
                src={coverImage}
                alt="AI-generated cover image"
                width={1024}
                height={512}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700 min-h-[300px] min-w-4xl">
            {isGenerating ? (
              <div className="prose dark:prose-invert prose-sm max-w-none w-full">
                <SkeletonLoading />
              </div>
            ) : output ? (
              <div className="prose dark:prose-invert prose-sm max-w-none w-full">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-center">
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
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { Copy, Send, Loader, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define form schema using zod
const formSchema = z.object({
  topic: z.string().min(10, "Topic must be at least 10 characters long"),
  title: z.string().min(5, "Title must be at least 5 characters long"),
  style: z.enum(["formal", "casual"]).default("formal"),
  audience: z.string().optional(),
  keywords: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CopyWritingDesktop() {
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingDerived, setIsGeneratingDerived] = useState(false);

  const [derivedType, setDerivedType] = useState<
    "Newsletter" | "Summary" | null
  >(null);
  const [savedContentId, setSavedContentId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      style: "formal",
      topic: "",
      title: "",
      audience: "",
      keywords: "",
    },
  });

  const handleGenerate = async (data: FormValues) => {
    setIsGenerating(true);
    setOutput(""); // Clear previous output when generating new content

    try {
      // Prepare keywords array
      const keywordsArray = data.keywords
        ? data.keywords.split(",").map((keyword) => keyword.trim())
        : [];

      const res = await fetch("/api/copywrite/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: data.topic,
          title: data.title,
          style: data.style,
          audience: data.audience,
          keywords: keywordsArray,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate blog content");
      }

      const result = await res.json();
      setOutput(result.output);

      // Save the content to the database
      if (result.output) {
        const saveRes = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title,
            topic: data.topic,
            audience: data.audience,
            style: data.style,
            keywords: keywordsArray,
            originalBlog: result.output,
          }),
        });

        if (saveRes.ok) {
          toast.success("Content saved to database");
        }
      }
    } catch (error) {
      console.error("Error generating blog content:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to copy markdown content to clipboard
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
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
      <h3 className="text-lg font-medium mb-6">
        Generate professional-quality blog posts with AI assistance, then create
        newsletters and summaries from them.
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        DISCLAIMER: This is a demo and the content generated is not guaranteed
        to be accurate or appropriate. Content is based solely on the documents
        uploaded to the tool.
      </p>

      <div className="space-y-6 max-w-4xl mx-auto desktop:min-w-[900px]">
        <form onSubmit={handleSubmit(handleGenerate)} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Blog Title
            </label>
            <input
              id="title"
              placeholder="Enter an interesting title for your blog..."
              {...register("title")}
              disabled={isGenerating}
              className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed mobile:text-[16px] mobile:leading-[16px]"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Topic Input */}
          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-2">
              Topic
            </label>
            <textarea
              id="topic"
              placeholder="Enter the topic or subject matter for your blog post..."
              {...register("topic")}
              disabled={isGenerating}
              className="w-full min-h-[120px] px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed mobile:text-[16px] mobile:leading-[16px]"
            />
            {errors.topic && (
              <p className="mt-1 text-sm text-red-500">
                {errors.topic.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Style Selection */}
            <div>
              <label htmlFor="style" className="block text-sm font-medium mb-2">
                Writing Style
              </label>
              <select
                id="style"
                {...register("style")}
                disabled={isGenerating}
                className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
              </select>
            </div>

            {/* Audience Input */}
            <div>
              <label
                htmlFor="audience"
                className="block text-sm font-medium mb-2"
              >
                Target Audience
              </label>
              <input
                id="audience"
                placeholder="e.g., Tech professionals, Parents, Students..."
                {...register("audience")}
                disabled={isGenerating}
                className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            {/* Keywords Input */}
            <div>
              <label
                htmlFor="keywords"
                className="block text-sm font-medium mb-2"
              >
                Keywords (comma separated)
              </label>
              <input
                id="keywords"
                placeholder="e.g., AI, productivity, innovation..."
                {...register("keywords")}
                disabled={isGenerating}
                className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex items-start justify-between w-full gap-4">
            <button
              type="submit"
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
                  Generate Blog Post
                </>
              )}
            </button>
          </div>
        </form>

        {/* Blog Content Output Section */}
        <div className="mt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">
              {isGenerating ? "Generating Blog Post..." : "Blog Post Content"}
            </h2>
            {output && !isGenerating && (
              <button
                onClick={() => copyToClipboard(output)}
                className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <Copy className="h-4 w-4 mr-1.5" />
                Copy Markdown
              </button>
            )}
          </div>

          {/* Disabled due to API Costs Cover Image Display 
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
            */}

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
                  Your generated blog post will appear here
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Fill out the form and click "Generate Blog Post"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Derived Content Section */}
        {output && !isGenerating && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Create Derived Content</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {}}
                  disabled={isGeneratingDerived}
                  className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isGeneratingDerived && derivedType === "Newsletter" ? (
                    <Loader className="h-4 w-4 mr-1.5 animate-spin" />
                  ) : (
                    <PlusIcon className="h-4 w-4 mr-1.5" />
                  )}
                  Newsletter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

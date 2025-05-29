"use client";

import { useBlogGenWizardStore } from "@/app/lib/stores/blogGenWizard-store";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import loadingAnimation from "@/public/animations/typing-animation.json";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const BlogGenPreview = () => {
  const {
    title,
    topic,
    style,
    audience,
    keywords,
    originalBlog,
    isGenerating,
    setOriginalBlog,
    setStep,
    setIsGenerating,
  } = useBlogGenWizardStore();

  // Skeleton loading component for the output section
  const SkeletonLoading = () => (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-8" />
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-5/6 mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-4/6 mb-8" />

      <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded w-2/6 mb-6" />
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-5/6 mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/6 mb-4" />
    </div>
  );

  useEffect(() => {
    const handleBlogGen = async () => {
      try {
        console.log("GENERATING BLOG POST");
        setIsGenerating(true);
        const keywordsArray = keywords
          ? keywords.split(",").map((keyword: string) => keyword.trim())
          : [];

        const res = await fetch("/api/copywrite/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: topic,
            title: title,
            style: style,
            audience: audience,
            keywords: keywordsArray,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to generate blog content");
        }

        console.log("GENERATED BLOG POST!");
        const { output } = await res.json();
        setOriginalBlog(output);
        toast.success("Blog generated successfully");
      } catch (error) {
        toast.error("Failed to generate blog content");
        throw new Error("Failed to generate blog content");
      } finally {
        setIsGenerating(false);
      }
    };

    handleBlogGen();
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Blog Preview</h1>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center my-8">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            className="w-[200px] h-[200px]"
          />
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            Generating your blog post...
          </p>
        </div>
      ) : null}

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 border border-gray-200 dark:border-zinc-700 w-full max-w-4xl">
        {isGenerating ? (
          <div className="prose dark:prose-invert prose-lg max-w-none w-full">
            <SkeletonLoading />
          </div>
        ) : (
          <div className="prose dark:prose-invert prose-lg max-w-none w-full">
            <ReactMarkdown>{originalBlog}</ReactMarkdown>
          </div>
        )}
      </div>

      {!isGenerating && originalBlog && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Editor
          </button>

          <button
            onClick={() => {
              if (originalBlog) {
                navigator.clipboard.writeText(originalBlog);
                toast.success("Blog copied to clipboard");
              }
            }}
            className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 rounded-md transition-colors"
          >
            Copy Content
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogGenPreview;

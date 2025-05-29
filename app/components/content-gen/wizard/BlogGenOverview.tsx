"use client";

import { useBlogGenWizardStore } from "@/app/lib/stores/blogGenWizard-store";
import {
  BlogGenOverviewSchema,
  BlogGenOverviewType,
} from "@/app/lib/types/blogGen.types";
import { Input } from "@/app/lib/ui/Input";
import { Textarea } from "@/app/lib/ui/Textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const BlogGenOverview = () => {
  const {
    title,
    topic,
    style,
    audience,
    keywords,
    setTitle,
    setStep,
    setTopic,
    setStyle,
    setAudience,
    setKeywords,
    setIsGenerating,
  } = useBlogGenWizardStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BlogGenOverviewType>({
    mode: "onChange",
    resolver: zodResolver(BlogGenOverviewSchema),
  });

  const handleBlogGenOverview: SubmitHandler<BlogGenOverviewType> = async (
    data: BlogGenOverviewType,
  ) => {
    try {
      // Get current values from store to compare with form data
      const currentState = useBlogGenWizardStore.getState();

      // Check if any of the core fields have been changed
      const hasChanges =
        currentState.title !== data.title ||
        currentState.topic !== data.topic ||
        currentState.style !== data.style;

      if (hasChanges) {
        // Update the store with new values
        setTitle(data.title);
        setTopic(data.topic);
        setStyle(data.style);
        setStep(2);
      } else {
        toast.error("No changes have been made");
        throw new Error("No changes made; Can't generate blog post");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    setStep(1);
  }, []);
  return (
    <div className="flex flex-col gap-4 justify-center items-center p-12 mt-6">
      <h1 className="text-4xl font-bold">Generate Blog</h1>
      <p className="text-lg text-gray-500">
        Use our AI to generate a blog post based on the topic, style, audience,
        and keywords you provide.
      </p>
      <form
        onSubmit={handleSubmit(handleBlogGenOverview)}
        className=" relative top-12 gap-4 w-[70%]"
      >
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-lg font-semibold font-sans">
            Title
          </label>
          <Input
            value={title}
            placeholder="Enter a title for your blog post"
            className="w-[80%]"
            {...register("title", {
              required: "Title is required",
              onChange: (e) => {
                e.preventDefault();
                setTitle(e.target.value);
              },
            })}
          />
          <p className="text-sm text-red-500">{errors.title?.message}</p>

          {/* Topic */}
          <label htmlFor="topic" className="text-lg font-semibold font-sans">
            Topic
          </label>
          <Textarea
            id="topic"
            value={topic}
            placeholder="Enter the topic or subject matter for your blog post..."
            {...register("topic", {
              required: "Topic is required",
              onChange: (e) => {
                e.preventDefault();
                setTopic(e.target.value);
              },
            })}
          />
          <p className="text-sm text-red-500">{errors.topic?.message}</p>

          <div className="flex flex-row gap-4 justify-between max-w-[100%] overflow-hidden">
            <div className="flex flex-col gap-2">
              {/* Style */}
              <label
                htmlFor="style"
                className="text-lg font-semibold font-sans"
              >
                Style
              </label>
              <select
                id="style"
                value={style}
                className="w-full h-[40px] rounded-md border border-gray-300 p-2"
                {...register("style", {
                  required: "Style is required",
                  onChange: (e) => {
                    e.preventDefault();
                    setStyle(e.target.value);
                  },
                })}
              >
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
              </select>
            </div>

            {/* Audience */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="audience"
                className="text-lg font-semibold font-sans"
              >
                Audience
              </label>
              <Input
                id="audience"
                value={audience}
                placeholder="Write about who you want to target..."
                className="w-full h-[40px] rounded-md border border-gray-300 p-2"
                {...register("audience", {
                  required: "Audience is required",
                  onChange: (e) => {
                    e.preventDefault();
                    setAudience(e.target.value);
                  },
                })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="keywords"
                className="text-lg font-semibold font-sans"
              >
                Keywords
              </label>
              <Input
                id="keywords"
                value={keywords}
                placeholder="Enter the keywords for your blog post..."
                className="min-w-full h-[40px] rounded-md border border-gray-300 p-2"
                {...register("keywords", {
                  required: "Keywords are required",
                  onChange: (e) => {
                    e.preventDefault();
                    setKeywords(e.target.value);
                  },
                })}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 w-[200px]"
          >
            Generate Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogGenOverview;

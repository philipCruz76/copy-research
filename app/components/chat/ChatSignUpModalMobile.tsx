"use client";

import { Drawer, DrawerContent, DrawerTitle } from "@/app/lib/ui/drawer";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { MessageCircle, Sparkles, Shield, Clock } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ChatSignUpModalMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatSignUpModalMobile = ({
  isOpen,
  onClose,
}: ChatSignUpModalMobileProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { redirectTo: "/chat" });
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: MessageCircle,
      title: "Chat with your documents",
      description:
        "Ask questions and get instant AI-powered answers from your uploaded content",
    },
    {
      icon: Sparkles,
      title: "Smart AI insights",
      description:
        "Get summaries, key points, and detailed analysis of complex documents",
    },
    {
      icon: Shield,
      title: "Secure & private",
      description:
        "Your documents and conversations are safely stored in our database",
    },
    {
      icon: Clock,
      title: "Save time",
      description:
        "Research faster and find information instantly instead of reading entire documents",
    },
  ];

  return (
    <Drawer
      open={isOpen}
      dismissible
      onOpenChange={(open) => !open && onClose()}
      shouldScaleBackground
      closeThreshold={0.4}
    >
      <DrawerContent className="bg-white dark:bg-zinc-900 rounded-t-xl border-t border-gray-100 dark:border-zinc-700 min-h-[85vh] max-h-[94vh] focus:outline-none">
        <DrawerTitle className=" flex justify-center text-xl font-sans font-semibold mb-2 text-black dark:text-white">
          Welcome to Research Assistant
        </DrawerTitle>
        <div className="absolute right-4 top-4 z-20">
          <button
            className="h-9 w-9 rounded-full flex items-center justify-center bg-black/20 text-white hover:bg-black/30 transition-colors"
            onClick={onClose}
            aria-label="Close"
            data-vaul-no-drag
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col h-full overflow-y-auto" data-vaul-no-drag>
          {/* Content Section */}
          <div className="flex-1 p-6">
            {/* Features List - Single Column for Mobile */}
            <div className="space-y-2 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex h-[90px] items-start p-4 rounded-lg bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 mr-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sign In Section */}
            <div className="space-y-4">
              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className={cn(
                  "w-full h-[50px] flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all duration-200 shadow-sm hover:shadow-md",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900",
                  isLoading && "opacity-70 cursor-not-allowed",
                )}
                data-vaul-no-drag
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="font-medium text-gray-900 dark:text-white text-base">
                  {isLoading ? "Signing in..." : "Continue with Google"}
                </span>
              </button>

              {/* Privacy Note */}
              <div className="text-center px-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  By signing in, you agree to our{" "}
                  <button className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                    Privacy Policy
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ChatSignUpModalMobile;

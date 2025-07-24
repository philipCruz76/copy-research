"use client";

import { Dialog, DialogContent, DialogTitle } from "@/app/lib/ui/dialog";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { MessageCircle, Sparkles, Shield, Clock } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ChatSignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatSignUpModalDesktop = ({ isOpen, onClose }: ChatSignUpModalProps) => {
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
    <Dialog open={isOpen} modal onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex flex-col fixed min-w-[520px] max-w-[600px] min-h-[600px] z-50 overflow-y-auto p-0">
        <div className="relative">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <DialogTitle className="text-xl font-bold mb-2 text-white">
                Welcome to Research Assistant
              </DialogTitle>
              <p className="text-indigo-100 text-lg leading-relaxed">
                Sign in to unlock AI-powered conversations with your documents
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start p-4 rounded-lg bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 mb-3 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                    <feature.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
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
                  "w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all duration-200 shadow-sm hover:shadow-md",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900",
                  isLoading && "opacity-70 cursor-not-allowed",
                )}
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
                <span className="font-medium text-gray-900 dark:text-white">
                  {isLoading ? "Signing in..." : "Continue with Google"}
                </span>
              </button>

              {/* Privacy Note */}
              <div className="text-center">
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
      </DialogContent>
    </Dialog>
  );
};

export default ChatSignUpModalDesktop;

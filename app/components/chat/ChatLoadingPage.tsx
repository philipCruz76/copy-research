"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import loadingAnimation from "@/public/animations/typing-animation.json";
import { motion } from "framer-motion";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function ChatLoadingPage() {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <motion.div
        className="flex flex-col items-center justify-center max-w-md mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animation */}
        <div className="w-48 h-48 mb-6">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Title */}
        <motion.h2
          className="text-xl font-semibold mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Loading conversations...
        </motion.h2>

        {/* Conditional message */}
        <motion.p
          className="text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: showMessage ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          This might take a moment
        </motion.p>

        {/* Loading dots */}
        <div className="flex items-center mt-6">
          <div className="animate-pulse h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full mr-1"></div>
          <div className="animate-pulse h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full mr-1 animation-delay-200"></div>
          <div className="animate-pulse h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animation-delay-400"></div>
        </div>

        {/* Backup skeleton loading (will be visible if Lottie fails to load) */}
        <div className="hidden">
          <div className="animate-pulse mt-8">
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-5/6 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-4/6 mb-4"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

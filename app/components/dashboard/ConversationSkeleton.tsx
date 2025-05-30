import { MessageSquare } from "lucide-react";

interface ConversationSkeletonProps {
  delay?: number;
}

const ConversationSkeleton = ({ delay = 0 }: ConversationSkeletonProps) => {
  return (
    <div 
      className="bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:scale-105 transition-all duration-300 rounded-lg p-3 border border-gray-200 dark:border-zinc-700 max-w-[95%] animate-fadeIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start flex-1">
          <MessageSquare className="h-4 w-4 mt-1 mr-2 text-gray-500 dark:text-gray-400 animate-pulse" />
          <div className="flex flex-col gap-2 items-start justify-start flex-1">
            {/* Title skeleton */}
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 rounded animate-shimmer bg-[length:200%_100%] w-32" />
            {/* Content skeleton */}
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 rounded animate-shimmer bg-[length:200%_100%] w-48" />
          </div>
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 ml-4">
          <div className="h-3 w-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 rounded-full mr-1 animate-shimmer bg-[length:200%_100%]" />
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 rounded animate-shimmer bg-[length:200%_100%] w-20" />
        </div>
      </div>
    </div>
  );
};

export default ConversationSkeleton;

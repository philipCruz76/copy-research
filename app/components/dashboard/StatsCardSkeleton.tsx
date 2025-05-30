import { LucideIcon } from "lucide-react";

interface StatsCardSkeletonProps {
  icon: LucideIcon;
  title: string;
  showViewAll?: boolean;
  delay?: number;
}

const StatsCardSkeleton = ({ 
  icon: Icon, 
  title, 
  showViewAll = false, 
  delay = 0 
}: StatsCardSkeletonProps) => {
  return (
    <div 
      className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 border border-gray-200 dark:border-zinc-700"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h2>
        <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      
      <div className="flex items-baseline mb-2">
        <div className="relative overflow-hidden">
          <div className="h-9 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 rounded-md animate-shimmer bg-[length:200%_100%]" />
        </div>
        <div className="ml-2 h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 rounded animate-shimmer bg-[length:200%_100%]" />
      </div>
      
      {showViewAll && (
        <div className="flex items-end justify-end mt-2">
          <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 rounded animate-shimmer bg-[length:200%_100%]" />
        </div>
      )}
    </div>
  );
};

export default StatsCardSkeleton; 
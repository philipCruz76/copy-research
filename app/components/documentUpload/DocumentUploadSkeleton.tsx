export default function DocumentUploadSkeleton() {
  return (
    <div className="flex flex-col h-full max-w-[100dvw] bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
      {/* Header Skeleton */}
      <header className="mb-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-80 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
      </header>

      {/* Form Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* File Upload Card Skeleton */}
        <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
          <div className="w-12 h-12 mb-4 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-4"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
        </div>

        {/* Web URL Card Skeleton */}
        <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
          <div className="w-12 h-12 mb-4 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-4"></div>
          <div className="flex">
            <div className="flex-1 h-10 bg-gray-200 dark:bg-zinc-800 rounded-l animate-pulse"></div>
            <div className="w-20 h-10 bg-gray-200 dark:bg-zinc-800 rounded-r animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

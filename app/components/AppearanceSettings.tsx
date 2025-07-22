"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only showing UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/4 mb-2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 dark:bg-zinc-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Component Header - more compact than page header */}
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Choose how the application appears to you
        </p>
      </div>

      {/* Theme Selection */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Light Theme Option */}
          <div
            className={`relative border rounded-lg p-3 cursor-pointer transition-all hover:shadow-sm ${
              theme === "light"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-400"
                : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
            }`}
            onClick={() => handleThemeChange("light")}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Sun className="h-4 w-4 mr-2 text-amber-500" />
                <span className="text-sm font-medium">Light</span>
              </div>
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  theme === "light"
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300 dark:border-zinc-600"
                }`}
              ></div>
            </div>
            {/* Light theme preview */}
            <div className="h-16 bg-gray-50 border border-gray-200 rounded"></div>
          </div>

          {/* Dark Theme Option */}
          <div
            className={`relative border rounded-lg p-3 cursor-pointer transition-all hover:shadow-sm ${
              theme === "dark"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-400"
                : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
            }`}
            onClick={() => handleThemeChange("dark")}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Moon className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">Dark</span>
              </div>
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  theme === "dark"
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300 dark:border-zinc-600"
                }`}
              ></div>
            </div>
            {/* Dark theme preview */}
            <div className="h-16 bg-zinc-900 border border-zinc-800 rounded"></div>
          </div>

          {/* System Theme Option */}
          <div
            className={`relative border rounded-lg p-3 cursor-pointer transition-all hover:shadow-sm ${
              theme === "system"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-400"
                : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
            }`}
            onClick={() => handleThemeChange("system")}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Monitor className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium">System</span>
              </div>
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  theme === "system"
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300 dark:border-zinc-600"
                }`}
              ></div>
            </div>
            {/* System theme preview - split view */}
            <div className="h-16 relative rounded overflow-hidden">
              <div className="absolute top-0 left-0 w-1/2 h-full bg-gray-50 border-r border-gray-200"></div>
              <div className="absolute top-0 right-0 w-1/2 h-full bg-zinc-900"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;

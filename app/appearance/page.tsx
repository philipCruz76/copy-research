"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [useBubbles, setUseBubbles] = useState(true);
  const [preferences, setPreferences] = useState({
    showTimestamps: false,
    useBubbles: true,
  });

  // Avoid hydration mismatch by only showing UI after mount
  useEffect(() => {
    setMounted(true);

    // Load saved preferences from localStorage if available
    const savedPreferences = localStorage.getItem("chatPreferences");
    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences);
      setShowTimestamps(parsed.showTimestamps);
      setUseBubbles(parsed.useBubbles);
      setPreferences(parsed);
    }
  }, []);

  const savePreferences = () => {
    const newPreferences = {
      showTimestamps,
      useBubbles,
    };
    localStorage.setItem("chatPreferences", JSON.stringify(newPreferences));
    setPreferences(newPreferences);

    // Show a toast or some feedback
    alert("Preferences saved successfully!");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Appearance</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Customize how the application looks
        </p>
      </header>

      <div className="max-w-2xl">
        <h2 className="text-lg font-medium mb-4">Theme</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Light Theme Option */}
          <div
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              theme === "light"
                ? "border-black dark:border-white"
                : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
            }`}
            onClick={() => setTheme("light")}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <Sun className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
                <span className="font-medium">Light</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border ${
                  theme === "light"
                    ? "border-black dark:border-white bg-black dark:bg-white"
                    : "border-gray-300 dark:border-zinc-700"
                }`}
              ></div>
            </div>
            {/* Light theme preview - always show light colors regardless of system theme */}
            <div className="h-24 bg-gray-100 rounded-md border border-gray-200"></div>
          </div>

          {/* Dark Theme Option */}
          <div
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              theme === "dark"
                ? "border-black dark:border-white"
                : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
            }`}
            onClick={() => setTheme("dark")}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <Moon className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
                <span className="font-medium">Dark</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border ${
                  theme === "dark"
                    ? "border-black dark:border-white bg-black dark:bg-white"
                    : "border-gray-300 dark:border-zinc-700"
                }`}
              ></div>
            </div>
            {/* Dark theme preview - always show dark colors regardless of system theme */}
            <div className="h-24 bg-zinc-900 rounded-md border border-zinc-800"></div>
          </div>

          {/* System Theme Option */}
          <div
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              theme === "system"
                ? "border-black dark:border-white"
                : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
            }`}
            onClick={() => setTheme("system")}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <Monitor className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
                <span className="font-medium">System</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border ${
                  theme === "system"
                    ? "border-black dark:border-white bg-black dark:bg-white"
                    : "border-gray-300 dark:border-zinc-700"
                }`}
              ></div>
            </div>
            {/* System theme preview - show split view */}
            <div className="h-24 relative rounded-md overflow-hidden">
              <div className="absolute top-0 left-0 w-1/2 h-full bg-gray-100 border-t border-l border-b border-gray-200"></div>
              <div className="absolute top-0 right-0 w-1/2 h-full bg-zinc-900 border-t border-r border-b border-zinc-800"></div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={savePreferences}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

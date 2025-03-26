"use client";

import {
  Settings as SettingsIcon,
  User,
  Key,
  Bell,
  Shield,
  Database,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account and preferences
        </p>
      </header>

      <div className="max-w-3xl">
        {/* Account Settings */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-medium">Account</h2>
          </div>

          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                value="user@example.com"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              Update Account
            </button>
          </div>
        </div>

        {/* API Settings */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Key className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-medium">API Keys</h2>
          </div>

          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">API Key</label>
              <div className="flex">
                <input
                  type="password"
                  value="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-l-md bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
                <button className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 rounded-r-md hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors">
                  Copy
                </button>
              </div>
            </div>

            <button className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
              Regenerate API Key
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-medium">Notifications</h2>
          </div>

          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive email updates about your account
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="email-notifications"
                  className="sr-only"
                />
                <div className="block h-6 bg-gray-300 dark:bg-zinc-700 rounded-full w-12"></div>
                <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Product Updates</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive updates about new features
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="product-updates"
                  className="sr-only"
                  defaultChecked
                />
                <div className="block h-6 bg-gray-300 dark:bg-zinc-700 rounded-full w-12"></div>
                <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Settings */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-medium">Data Management</h2>
          </div>

          <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 space-y-4">
            <div>
              <h3 className="font-medium mb-2">Export Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Download all your data including chat history and documents
              </p>
              <button className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
                Export All Data
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
              <h3 className="font-medium mb-2 text-red-500">Danger Zone</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Permanently delete your account and all associated data
              </p>
              <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

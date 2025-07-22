import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import Image from "next/image";
import AppearanceSettings from "../components/AppearanceSettings";

export default async function AccountPage() {
  const session = await auth();
  const conversationsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/conversations`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "reload",
      next: {
        revalidate: 600, //10 minutes
      },
    },
  );
  const conversations = await conversationsResponse.json();
  const documentsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/documents`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "reload",
      next: {
        revalidate: 600, //10 minutes
      },
    },
  );
  const documents = await documentsResponse.json();

  if (!session) {
    redirect("/");
  }

  const user = session.user;

  return (
    <div className="flex overflow-y-scroll overflow-x-clip">
      <div className="flex flex-col items-start justify-center w-full h-full px-[15%] py-[5%] gap-4 ">
        <h1 className="text-lg font-medium text-black dark:text-white">
          Account
        </h1>
        <div className="w-full h-[1px] bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex flex-row gap-3 justify-center">
          <Image
            src={user?.image || "/icons/user-icon.svg"}
            alt=""
            width={42}
            height={42}
            className="rounded-full focus:ring-0 min-w-[42px] min-h-[42px] text-black group-hover:opacity-80 group-hover:scale-105 transition-all duration-100"
          />
          <div className="flex flex-col items-start justify-center">
            <span className="text-sm font-medium text-black dark:text-white">
              {user?.name}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {user?.email}
            </span>
          </div>
        </div>
        {/** Full Name */}
        <div className="flex flex-col items-start justify-center">
          <span className=" text-black dark:text-white">Full Name</span>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {user?.name}
          </span>
        </div>
        {/** Email */}
        <div className="flex flex-col items-start justify-center">
          <span className=" text-black dark:text-white">Email</span>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {user?.email}
          </span>
        </div>

        {/** Subscription */}
        <h2 className="text-lg font-medium text-black dark:text-white pt-6">
          Subscription
        </h2>
        <div className="w-full h-[1px] bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Conversations Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-black dark:text-white">
                  Conversations
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {conversations.length} of 3 used
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Usage</span>
                <span className="font-medium text-black dark:text-white">
                  {conversations.length}/3
                </span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    conversations.length >= 3
                      ? "dark:bg-red-800 bg-red-300"
                      : conversations.length >= 2
                        ? "dark:bg-yellow-800 bg-yellow-300"
                        : "dark:bg-green-800 bg-green-300"
                  }`}
                  style={{ width: `${(conversations.length / 3) * 100}%` }}
                />
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 flex justify-between">
                <span>0</span>
                <span>3</span>
              </div>
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-800 rounded-lg">
                <svg
                  className="w-5 h-5 text-purple-600 dark:text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-black dark:text-white">
                  Documents
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {documents.length} of 10 used
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Usage</span>
                <span className="font-medium text-black dark:text-white">
                  {documents.length}/10
                </span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    documents.length >= 10
                      ? "bg-red-300 dark:bg-red-800"
                      : documents.length >= 8
                        ? "bg-yellow-300 dark:bg-yellow-800"
                        : "bg-green-300 dark:bg-green-800"
                  }`}
                  style={{ width: `${(documents.length / 10) * 100}%` }}
                />
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 flex justify-between">
                <span>0</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-center w-full pt-6">
          <h2 className="text-lg font-medium text-black dark:text-white">
            Appearance
          </h2>
          <div className="w-full h-[1px] bg-zinc-200 dark:bg-zinc-800" />
          <AppearanceSettings />
        </div>
      </div>
    </div>
  );
}

"use server";

import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import Image from "next/image";
import AppearanceSettings from "../components/AppearanceSettings";
import { Conversation } from "@prisma/client";
import ConversationHistory from "../components/navigation/ConversationHistory";
import { ConversationLimitsCard } from "../components/account/ConversationLimitsCard";
import { DocumentLimitsCard } from "../components/account/DocumentLimitsCard";

export default async function AccountPage() {
  const session = await auth();

  const documentsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/documents`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache",
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
          <ConversationLimitsCard />

          {/* Documents Card */}
          <DocumentLimitsCard />
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

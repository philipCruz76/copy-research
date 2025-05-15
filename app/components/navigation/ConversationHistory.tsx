"use client";

import { deleteConversation } from "@/app/lib/actions/conversation-actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/lib/ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import { useConversationStore } from "@/app/lib/stores/conversation-store";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/lib/ui/tooltip";

interface ConversationHistoryProps {
  isCollapsed?: boolean;
}

export default function ConversationHistory({
  isCollapsed = false,
}: ConversationHistoryProps) {
  const router = useRouter();
  const { conversations } = useConversationStore();
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    "Previous 7 Days": true,
    "Previous 30 Days": true,
  });

  // If sidebar is collapsed, don't render anything
  if (isCollapsed) {
    return null;
  }

  // Group conversations by date
  const groupedConversations = conversations.reduce(
    (groups: any, conversation) => {
      const createdAt = conversation.createdAt
        ? new Date(conversation.createdAt)
        : new Date();
      const now = new Date();
      const diffInDays = Math.floor(
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
      );

      let group = "Previous 30 Days";
      if (diffInDays < 7) {
        group = "Previous 7 Days";
      }

      if (!groups[group]) {
        groups[group] = [];
      }

      groups[group].push(conversation);
      return groups;
    },
    {},
  );

  // Function to toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Function to get conversation title
  const getConversationTitle = (conversation: any) => {
    // If title exists, use it
    if (conversation.title) return conversation.title;

    return `${conversation.id}`;
  };

  const handleDelete = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
      router.push("/chat");
    } catch (error) {
      toast.error("Failed to delete conversation");
    }
  };

  return (
    <div className="py-2 text-sm w-full">
      {Object.entries(groupedConversations).map(
        ([section, convs]: [string, any]) => (
          <div key={section} className="py-1">
            

            <span className="text-sm font-semibold ">{section}</span>
            {expandedSections[section] && (
              <ul className=" space-y-2 ">
                {(convs as any[]).map((conversation) => (
                  <li
                    key={conversation.id}
                    className="rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  >
                    <Link
                      href={`/chat/${conversation.id}`}
                      className="block py-1 px-2 w-full"
                    >
                      <div className="flex items-center justify-between group text-sm">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="text-gray-700 dark:text-gray-300  text-nowrap overflow-hidden  group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              {conversation.title}
                            </TooltipTrigger>
                            <TooltipContent>
                              {conversation.title}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="opacity-0 group-hover:opacity-100 focus:outline-none focus:opacity-100 data-[state=open]:opacity-100 p-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-[18px] h-[18px]" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-red-500 hover:text-red-700 cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(conversation.id);
                              }}
                            >
                              <Trash className="w-3 h-3" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ),
      )}

      {Object.keys(groupedConversations).length === 0 && (
        <div className="py-1 px-2 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No conversations
          </p>
        </div>
      )}
    </div>
  );
}

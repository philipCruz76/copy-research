"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SvgIcon from "./SvgIcon";

interface SidebarProps {
  className?: string;
}

// Animation variants
const sidebarVariants = {
  open: {
    width: "16rem",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  closed: {
    width: "5rem",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const itemVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const textVariants = {
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
    },
  }),
  closed: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.2,
    },
  },
};

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.div
      className="h-full flex flex-col bg-gray-50 dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 relative"
      initial={false}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
    >
      {/* Toggle Button */}
      <motion.button
        className="absolute -right-3 top-6 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-gray-600 text-white shadow-md hover:bg-gray-700 transition-colors"
        onClick={toggleSidebar}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isCollapsed ? (
            <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
          ) : (
            <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
          )}
        </svg>
      </motion.button>

      {/* Logo/Header */}
      <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center">
        <Link href="/dashboard" className="flex items-center">
          <div className="w-8 h-8 mr-2 flex items-center justify-center rounded-md text-gray-700 dark:text-gray-300">
            <SvgIcon
              src="/icons/dashboard.svg"
              alt="Dashboard"
              width={20}
              height={20}
              className="text-current"
            />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h1
                className="text-lg font-semibold text-black dark:text-white"
                variants={textVariants}
                initial="closed"
                animate="open"
                exit="closed"
                custom={0}
              >
                Dashboard
              </motion.h1>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin">
        <NavItem
          href="/dashboard"
          icon="/icons/dashboard.svg"
          text="Dashboard"
          isCollapsed={isCollapsed}
          index={0}
        />

        <NavItem
          href="/chat"
          icon="/icons/robot.svg"
          text="Chat"
          isCollapsed={isCollapsed}
          index={1}
        />

        <NavItem
          href="/add-documents"
          icon="/icons/plus-circle.svg"
          text="Add Documents"
          isCollapsed={isCollapsed}
          index={2}
        />

        <NavItem
          href="/documents"
          icon="/icons/file-text.svg"
          text="Documents"
          isCollapsed={isCollapsed}
          index={3}
        />

        <NavItem
          href="/copywritter"
          icon="/icons/clock.svg"
          text="Copywritter"
          isCollapsed={isCollapsed}
          index={4}
        />

        <NavItem
          href="/appearance"
          icon="/icons/paintbrush.svg"
          text="Appearance"
          isCollapsed={isCollapsed}
          index={5}
        />

        <NavItem
          href="/settings"
          icon="/icons/settings.svg"
          text="Settings"
          isCollapsed={isCollapsed}
          index={6}
        />
      </nav>

      {/* Footer Links */}
      <div
        className={`p-4 text-xs text-black dark:text-gray-400 ${isCollapsed ? "hidden" : "block"}`}
      >
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={itemVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <Link
                href="/whats-new"
                className="block hover:text-indigo-500 transition-colors"
              >
                What's new?
              </Link>
              <div className="flex flex-col mt-4 space-y-1">
                <Link
                  href="/report-bug"
                  className="hover:text-indigo-500 transition-colors"
                >
                  Report a Bug
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface NavItemProps {
  href: string;
  icon: string;
  text: string;
  isCollapsed: boolean;
  index: number;
}

function NavItem({ href, icon, text, isCollapsed, index }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} p-3 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group`}
    >
      <div className="flex items-center">
        <motion.div
          className="relative flex items-center justify-center w-8 h-8 rounded-md text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <SvgIcon
            src={icon}
            alt={text}
            width={20}
            height={20}
            className="text-current"
          />
        </motion.div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              className="ml-3 text-sm font-medium text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
              variants={textVariants}
              initial="closed"
              animate="open"
              exit="closed"
              custom={index}
            >
              {text}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
}

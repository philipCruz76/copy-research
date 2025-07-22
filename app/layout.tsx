import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { Sidebar } from "@/app/components/navigation/Sidebar";
import { auth } from "./lib/auth";
import { QueryProvider } from "./components/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Research Assistant",
  description:
    "A powerful AI-driven research platform for document analysis, intelligent conversations, and content generation",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-zinc-900`}
      >
        <QueryProvider>
          <ThemeProvider>
            <div className="flex h-screen">
              <Sidebar userSession={session} />
              <main className="flex-1 overflow-auto bg-white dark:bg-zinc-900">
                {children}
              </main>
            </div>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

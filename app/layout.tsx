import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shorts-Maker | AI Video Generator & Auto-Scheduler",
  description: "Automate your viral success. AI short video generator and auto-scheduler for YouTube Shorts, Instagram Reels, TikTok, and Email marketing.",
  keywords: ["AI video generator", "shorts maker", "youtube shorts", "instagram reels", "tiktok", "auto scheduler", "SaaS"],
  openGraph: {
    title: "Shorts-Maker | AI Video Generator & Auto-Scheduler",
    description: "Automate your viral success. AI short video generator and auto-scheduler for YouTube Shorts, Instagram Reels, TikTok, and Email marketing.",
    type: "website",
  },
  icons: {
    icon: "/brand_logo_v2.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-mono", jetbrainsMono.variable)}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}

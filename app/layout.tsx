import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Personal Dev Tracker",
  description:
    "Track your development projects, features, tasks, and decisions",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <div className="flex h-screen overflow-hidden">
          {/* Desktop Sidebar - hidden on mobile */}
          <aside className="hidden md:block">
            <AppSidebar />
          </aside>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <AppHeader />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}

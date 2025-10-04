
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { CommandPalette } from "@/components/layout/command-palette";
import { ThemeProvider } from "@/components/layout/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Pandora",
  description: "Your all-in-one system management and operations platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <SidebarNav />
            <SidebarInset>
              <Header />
              <main className="flex flex-1 flex-col gap-6 p-6">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}

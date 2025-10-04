
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
import SettingsLayout from "./settings/layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Pandora",
  description: "Your all-in-one system management and operations platform.",
};

export default function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { slug: string[] };
}>) {
  
  const isSettingsPage = Array.isArray(params?.slug) && params.slug[0] === 'settings';

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
              {isSettingsPage ? (
                 <main className="flex flex-1 flex-col gap-6 p-6">
                    <SettingsLayout>{children}</SettingsLayout>
                  </main>
              ) : (
                <>
                  <Header />
                  <main className="flex flex-1 flex-col gap-6 p-6">
                    {children}
                  </main>
                </>
              )}
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}

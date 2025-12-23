"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error }: { error: Error }) {
  console.error("App error boundary:", error);

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md space-y-4 rounded-2xl border bg-card p-6 shadow-lg">
          <h1 className="text-2xl font-headline">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            We hit an unexpected error. Please sign in again or try returning to the home page.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/login">Go to login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}



'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
          <div className="w-full max-w-md rounded-2xl border p-8 text-center shadow-lg">
            <h1 className="text-2xl font-bold text-destructive">
              Something went wrong!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              An unexpected error occurred. Please try again.
            </p>
            
            {/* Display error details in development for easier debugging */}
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 max-h-60 overflow-auto rounded-lg bg-muted p-4 text-left text-xs">
                {error.stack || error.message}
              </pre>
            )}

            <Button onClick={() => reset()} className="mt-6">
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Icon */}
        <div className="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error Content */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Oops! Something went wrong
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            We&apos;re sorry, but something unexpected happened. Don&apos;t
            worry, our team has been notified and we&apos;re working on it.
          </p>
        </div>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="text-left bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-sm text-foreground">
              Error Details:
            </h3>
            <p className="text-xs text-muted-foreground font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Error ID:</span> {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default">
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="text-sm text-muted-foreground">
          <p>Still having trouble?</p>
          <Button asChild variant="link" className="h-auto p-0 text-sm">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

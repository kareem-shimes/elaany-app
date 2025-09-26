import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 Illustration */}
        <div className="mx-auto space-y-4">
          <div className="text-6xl font-bold text-primary/20">404</div>
          <div className="mx-auto w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 0a1 1 0 100-2h6a1 1 0 100 2m-6 0v6a1 1 0 102 0v-6m4 0v6a1 1 0 102 0v-6"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default">
              <Link href="/">Go to Homepage</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Or try one of these:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild variant="link" className="h-auto p-0 text-sm">
                <Link href="/categories">Categories</Link>
              </Button>
              <span className="text-muted-foreground">•</span>
              <Button asChild variant="link" className="h-auto p-0 text-sm">
                <Link href="/search">Search</Link>
              </Button>
              <span className="text-muted-foreground">•</span>
              <Button asChild variant="link" className="h-auto p-0 text-sm">
                <Link href="/account">My Account</Link>
              </Button>
              <span className="text-muted-foreground">•</span>
              <Button asChild variant="link" className="h-auto p-0 text-sm">
                <Link href="/contact">Contact</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-3">
            Looking for something specific?
          </p>
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link href="/search">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search Our Store
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

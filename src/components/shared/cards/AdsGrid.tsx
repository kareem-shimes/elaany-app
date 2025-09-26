"use client";

import { Ad } from "@/types";
import { AdCard } from "./AdCard";
import { Button } from "@/components/ui/button";
import { Grid, List, Loader2 } from "lucide-react";
import { useState } from "react";

interface AdsGridProps {
  ads: Ad[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onFavorite?: (adId: string) => void;
  favoriteIds?: string[];
  title?: string;
  showViewToggle?: boolean;
}

export function AdsGrid({
  ads,
  loading = false,
  hasMore = false,
  onLoadMore,
  onFavorite,
  favoriteIds = [],
  title = "Latest Ads",
  showViewToggle = true,
}: AdsGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (loading && ads.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading ads...</span>
      </div>
    );
  }

  if (!loading && ads.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No ads found
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Try adjusting your search criteria or browse different categories to
          find what you&apos;re looking for.
        </p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Refresh Results
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">
            {ads.length.toLocaleString()} ads found
          </p>
        </div>

        {/* View Toggle */}
        {showViewToggle && (
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Ads Grid */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {ads.map((ad) => (
          <AdCard
            key={ad.id}
            ad={ad}
            onFavorite={onFavorite}
            isFavorited={favoriteIds.includes(ad.id)}
            className={viewMode === "list" ? "flex flex-row h-48" : ""}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            size="lg"
            variant="outline"
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Ads"
            )}
          </Button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loading && ads.length > 0 && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading more ads...</span>
        </div>
      )}
    </div>
  );
}

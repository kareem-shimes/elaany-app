"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdListing from "@/features/home/components/AdListing";
import AdSearchBar from "@/features/home/components/AdSearchBar";
import { useAdSearch } from "@/hooks/useAdSearch";
import { SearchParams as AdSearchParams } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, SlidersHorizontal } from "lucide-react";

interface SearchPageClientProps {
  initialQuery: string;
  initialCategory: string;
  initialLocation: string;
}

export default function SearchPageClient({
  initialQuery,
  initialCategory,
  initialLocation,
}: SearchPageClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentSearchParams, setCurrentSearchParams] =
    useState<AdSearchParams>({
      query: initialQuery || undefined,
      category: initialCategory || undefined,
      location: initialLocation || undefined,
    });

  const {
    searchResults,
    isSearching,
    hasMore,
    totalResults,
    searchAds,
    loadMore,
    clearSearch,
  } = useAdSearch();

  // Search when component mounts or initial params change
  useEffect(() => {
    if (initialQuery || initialCategory || initialLocation) {
      const params: AdSearchParams = {
        query: initialQuery || undefined,
        category: initialCategory || undefined,
        location: initialLocation || undefined,
      };
      setCurrentSearchParams(params);
      searchAds(params);
    }
  }, [initialQuery, initialCategory, initialLocation, searchAds]);

  const updateUrl = (params: AdSearchParams) => {
    const url = new URL(window.location.href);

    // Clear existing params
    url.searchParams.delete("q");
    url.searchParams.delete("category");
    url.searchParams.delete("location");

    // Set new params
    if (params.query) url.searchParams.set("q", params.query);
    if (params.category) url.searchParams.set("category", params.category);
    if (params.location) url.searchParams.set("location", params.location);

    router.push(url.pathname + url.search);
  };

  const handleSearch = (newQuery: string) => {
    const params: AdSearchParams = {
      ...currentSearchParams,
      query: newQuery || undefined,
    };
    setCurrentSearchParams(params);
    setSearchQuery(newQuery);
    updateUrl(params);
    searchAds(params);
  };

  const handleClear = () => {
    setSearchQuery("");
    setCurrentSearchParams({});
    clearSearch();
    router.push("/search");
  };

  const handleLoadMore = () => {
    loadMore(currentSearchParams);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentSearchParams.query) count++;
    if (currentSearchParams.category) count++;
    if (currentSearchParams.location) count++;
    if (currentSearchParams.minPrice) count++;
    if (currentSearchParams.maxPrice) count++;
    if (currentSearchParams.condition) count++;
    return count;
  };

  const hasActiveSearch = initialQuery || initialCategory || initialLocation;
  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="container px-4 py-6">
      {/* Search Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <AdSearchBar
                value={searchQuery}
                onSearch={handleSearch}
                onClear={handleClear}
                placeholder="ابحث عن سلعة..."
              />
            </div>

            {/* Filter Button */}
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>الفلاتر</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Active Filters Display */}
          {hasActiveSearch && (
            <div className="mt-4 flex flex-wrap gap-2">
              {currentSearchParams.query && (
                <Badge variant="outline" className="flex items-center gap-1">
                  البحث: {currentSearchParams.query}
                  <button
                    onClick={() => handleSearch("")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {currentSearchParams.category && (
                <Badge variant="outline" className="flex items-center gap-1">
                  الفئة: {currentSearchParams.category}
                  <button
                    onClick={() => {
                      const params = { ...currentSearchParams };
                      delete params.category;
                      setCurrentSearchParams(params);
                      updateUrl(params);
                      searchAds(params);
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {currentSearchParams.location && (
                <Badge variant="outline" className="flex items-center gap-1">
                  الموقع: {currentSearchParams.location}
                  <button
                    onClick={() => {
                      const params = { ...currentSearchParams };
                      delete params.location;
                      setCurrentSearchParams(params);
                      updateUrl(params);
                      searchAds(params);
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="mb-4">
        {hasActiveSearch && !isSearching && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {totalResults > 0
                ? `تم العثور على ${totalResults.toLocaleString("ar")} إعلان`
                : "لم يتم العثور على نتائج"}
            </h2>
            {totalResults > 0 && (
              <div className="text-sm text-muted-foreground">
                عرض {searchResults.length} من{" "}
                {totalResults.toLocaleString("ar")}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {hasActiveSearch ? (
        <AdListing
          ads={searchResults}
          loading={isSearching}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        />
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">ابحث عن الإعلانات</h3>
            <p className="text-muted-foreground mb-6">
              استخدم شريط البحث أعلاه للعثور على السلع والخدمات التي تحتاجها
            </p>
            <div className="text-sm text-muted-foreground">
              <p>يمكنك البحث بالكلمات المفتاحية، الفئة، أو الموقع</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

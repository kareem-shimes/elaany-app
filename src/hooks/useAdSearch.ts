import { useState, useCallback } from "react";
import { Ad, ApiResponse, SearchParams } from "@/types";

export function useAdSearch() {
  const [searchResults, setSearchResults] = useState<Ad[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const searchAds = useCallback(
    async (params: SearchParams, loadMore = false) => {
      try {
        setIsSearching(true);
        setSearchError(null);

        const searchParams = new URLSearchParams();

        if (params.query) searchParams.set("q", params.query);
        if (params.category) searchParams.set("category", params.category);
        if (params.location) searchParams.set("location", params.location);
        if (params.minPrice)
          searchParams.set("minPrice", params.minPrice.toString());
        if (params.maxPrice)
          searchParams.set("maxPrice", params.maxPrice.toString());
        if (params.condition) searchParams.set("condition", params.condition);
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);

        const page = loadMore ? currentPage + 1 : 1;
        searchParams.set("page", page.toString());
        searchParams.set("limit", "10");

        const response = await fetch(
          `/api/ads/search?${searchParams.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to search ads");
        }

        const data: ApiResponse<Ad[]> = await response.json();

        if (loadMore) {
          setSearchResults((prev) => [...prev, ...data.data]);
          setCurrentPage(page);
        } else {
          setSearchResults(data.data);
          setCurrentPage(1);
        }

        setHasMore(data.hasNext);
        setTotalResults(data.total);
      } catch (error) {
        setSearchError(
          error instanceof Error ? error.message : "Search failed"
        );
        if (!loadMore) {
          setSearchResults([]);
          setTotalResults(0);
        }
      } finally {
        setIsSearching(false);
      }
    },
    [currentPage]
  );

  const loadMore = useCallback(
    (params: SearchParams) => {
      if (!isSearching && hasMore) {
        searchAds(params, true);
      }
    },
    [searchAds, isSearching, hasMore]
  );

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
    setHasMore(false);
    setCurrentPage(1);
    setTotalResults(0);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    hasMore,
    totalResults,
    searchAds,
    loadMore,
    clearSearch,
  };
}

"use client";

import { Ad, ApiResponse, SearchParams } from "@/types";
import { useCallback, useEffect, useState } from "react";

interface UseAdsReturn {
  ads: Ad[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  page: number;
  loadMore: () => void;
  refresh: () => void;
}

export function useAds(searchParams: SearchParams = {}): UseAdsReturn {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchAds = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "10",
        });

        // Add search parameters
        if (searchParams.query) params.set("query", searchParams.query);
        if (searchParams.category)
          params.set("category", searchParams.category);
        if (searchParams.subcategory)
          params.set("subcategory", searchParams.subcategory);
        if (searchParams.location)
          params.set("location", searchParams.location);
        if (searchParams.minPrice)
          params.set("minPrice", searchParams.minPrice.toString());
        if (searchParams.maxPrice)
          params.set("maxPrice", searchParams.maxPrice.toString());
        if (searchParams.condition)
          params.set("condition", searchParams.condition);
        if (searchParams.sortBy) params.set("sortBy", searchParams.sortBy);

        const response = await fetch(`/api/ads?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch ads");
        }

        const result: ApiResponse<Ad[]> = await response.json();

        if (append) {
          setAds((prev) => [...prev, ...result.data]);
        } else {
          setAds(result.data);
        }

        setHasMore(result.hasNext);
        setTotal(result.total);
        setPage(pageNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching ads:", err);
      } finally {
        setLoading(false);
      }
    },
    [searchParams]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchAds(page + 1, true);
    }
  }, [loading, hasMore, page, fetchAds]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchAds(1, false);
  }, [fetchAds]);

  useEffect(() => {
    setPage(1);
    fetchAds(1, false);
  }, [fetchAds]);

  return {
    ads,
    loading,
    error,
    hasMore,
    total,
    page,
    loadMore,
    refresh,
  };
}

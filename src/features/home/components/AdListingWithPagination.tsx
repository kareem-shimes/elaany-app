"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import AdListing from "./AdListing";
import { Ad } from "@/types";

interface AdListingWithPaginationProps {
  initialAds: Ad[];
  initialHasMore: boolean;
}

export default function AdListingWithPagination({
  initialAds,
  initialHasMore,
}: AdListingWithPaginationProps) {
  const [ads, setAds] = useState<Ad[]>(initialAds);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", nextPage.toString());

      const response = await fetch(`/api/ads?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch ads");

      const data = await response.json();

      setAds((prev) => [...prev, ...data.data]);
      setHasMore(data.hasNext);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Error loading more ads:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentPage, searchParams]);

  return (
    <AdListing
      ads={ads}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={loadMore}
    />
  );
}

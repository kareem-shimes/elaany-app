"use client";
import AdSearchBar from "./AdSearchBar";
import { PlusIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "@/components/ui/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Ad } from "@/types";

export default function AdsToolbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleAdSelect = (ad: Ad) => {
    router.push(`/ads/${ad.id}`);
  };

  return (
    <div className="container flex items-center flex-col md:flex-row justify-between gap-4 py-4">
      <div className="flex-1 max-w-2xl w-full">
        <AdSearchBar
          onSearch={handleSearch}
          onClear={handleClear}
          onAdSelect={handleAdSelect}
          value={searchQuery}
          placeholder="ابحث عن سلعة، خدمة، عقار..."
        />
      </div>
      <Link
        href="/add-ad"
        className={cn(buttonVariants({ size: "lg" }), "md:h-12")}
      >
        انشر إعلانك
        <PlusIcon className="ml-2 h-4 w-4" />
      </Link>
    </div>
  );
}

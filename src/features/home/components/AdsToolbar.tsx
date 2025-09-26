"use client";
import AdSearchBar from "./AdSearchBar";
import { PlusIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "@/components/ui/link";
import { useState } from "react";

export default function AdsToolbar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClear = () => {
    setSearchQuery("");
  };
  return (
    <div className="container flex items-center flex-col md:flex-row justify-between gap-4 py-4">
      <div className="flex-1 max-w-2xl w-full">
        <AdSearchBar
          onSearch={handleSearch}
          onClear={handleClear}
          value={searchQuery}
          placeholder="ابحث عن سلعة، خدمة، عقار..."
        />
      </div>
      <Link href="/add-ad" className={buttonVariants({ size: "lg" })}>
        انشر إعلانك
        <PlusIcon className="ml-2 h-4 w-4" />
      </Link>
    </div>
  );
}

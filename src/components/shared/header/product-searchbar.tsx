"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

export default function ProductSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Perform search action
      console.log("Searching for:", searchQuery);
      // You can redirect to search page or trigger search API here
      // Example: router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-3 bg-input h-12 rounded-[62px] px-4 md:w-[577px] max-w-full">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSearch}
        className="h-6 w-6 hover:bg-transparent transition-colors text-muted hover:text-foreground"
      >
        <SearchIcon />
      </Button>
      <Input
        placeholder="Search for products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        className="border-none bg-transparent focus-visible:ring-0"
      />
    </div>
  );
}

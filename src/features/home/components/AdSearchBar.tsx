"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import { useState } from "react";

interface AdSearchBarProps {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  value?: string;
  placeholder?: string;
}

export default function AdSearchBar({
  onSearch,
  onClear,
  value = "",
  placeholder = "ابحث عن سلعة",
}: AdSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(value);

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
    onClear?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center rounded-md overflow-hidden flex-1 max-w-4xl h-10 relative ">
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="border border-border border-l-0 !rounded-l-none pr-4 "
      />
      {searchQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute left-14 h-6 w-6 p-0 hover:text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <Button
        size="lg"
        className="rounded-tr-none rounded-br-none"
        onClick={handleSearch}
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

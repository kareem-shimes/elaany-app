"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SearchIcon, X, Clock, MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Ad } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useAdSearch } from "@/hooks/useAdSearch";
import { useDebounce } from "@/hooks/useDebounce";

interface AdSearchBarProps {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  value?: string;
  placeholder?: string;
  onAdSelect?: (ad: Ad) => void;
}

export default function AdSearchBar({
  onSearch,
  onClear,
  value = "",
  placeholder = "ابحث عن سلعة",
  onAdSelect,
}: AdSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { searchResults, isSearching, searchAds, clearSearch } = useAdSearch();
  const debouncedQuery = useDebounce(searchQuery, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse recent searches:", error);
      }
    }
  }, []);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim() && isOpen) {
      // Use autocomplete endpoint for better suggestions
      fetch(`/api/ads/autocomplete?q=${encodeURIComponent(debouncedQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data.suggestions || []);
          if (data.ads) {
            // Update search results with autocomplete ads
            clearSearch();
            searchAds({ query: debouncedQuery });
          }
        })
        .catch(console.error);
    } else if (!debouncedQuery.trim()) {
      setSuggestions([]);
      clearSearch();
    }
  }, [debouncedQuery, isOpen, searchAds, clearSearch]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

      onSearch?.(searchQuery);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setSuggestions([]);
    clearSearch();
    onClear?.();
    // Keep dropdown open and focus input for immediate typing
    setTimeout(() => {
      inputRef.current?.focus();
      setIsOpen(true);
    }, 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
    setIsOpen(false);
  };

  const handleAdClick = (ad: Ad) => {
    onAdSelect?.(ad);
    setIsOpen(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    setSuggestions([]);
    localStorage.removeItem("recentSearches");
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="flex items-center rounded-md flex-1 max-w-4xl relative h-12">
      <div
        className="flex items-center w-full"
        onClick={(e) => {
          // Only focus input if not clicking the clear button
          if (!(e.target as HTMLElement).closest("button")) {
            inputRef.current?.focus();
            setIsOpen(true);
          }
        }}
      >
        <Input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsOpen(true)}
          onBlur={(e) => {
            // Don't close if clicking inside the dropdown
            const relatedTarget = e.relatedTarget as HTMLElement;
            if (
              !relatedTarget ||
              !relatedTarget.closest("[data-dropdown-content]")
            ) {
              setTimeout(() => setIsOpen(false), 150);
            }
          }}
          placeholder={placeholder}
          className="border border-border !h-12 border-l-0 !rounded-l-none pr-4 flex-1"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute left-14 h-6 w-6 p-0 hover:text-primary z-10"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Custom Dropdown */}
        {isOpen && (
          <div
            data-dropdown-content
            className="absolute top-full left-0 w-full mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto min-w-[300px]"
            onMouseDown={(e) => e.preventDefault()} // Prevent input blur when clicking dropdown
            onClick={(e) => e.stopPropagation()} // Prevent event bubbling
          >
            <Command className="rounded-lg border-0" shouldFilter={false}>
              <CommandList>
                {/* Recent Searches */}
                {!searchQuery && recentSearches.length > 0 && (
                  <CommandGroup heading="البحث الأخير">
                    {recentSearches.map((query, index) => (
                      <CommandItem
                        key={index}
                        onSelect={() => handleRecentSearchClick(query)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{query}</span>
                      </CommandItem>
                    ))}
                    <CommandItem
                      onSelect={clearRecentSearches}
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      مسح السجل
                    </CommandItem>
                  </CommandGroup>
                )}

                {/* Search Suggestions */}
                {searchQuery && suggestions.length > 0 && (
                  <CommandGroup heading="اقتراحات البحث">
                    {suggestions.map((suggestion, index) => (
                      <CommandItem
                        key={index}
                        onSelect={() => handleRecentSearchClick(suggestion)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <SearchIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{suggestion}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Search Results */}
                {searchQuery && (
                  <>
                    {isSearching && (
                      <CommandGroup>
                        <div className="flex items-center justify-center py-6">
                          <div className="text-sm text-muted-foreground">
                            جاري البحث...
                          </div>
                        </div>
                      </CommandGroup>
                    )}

                    {!isSearching &&
                      searchResults.length === 0 &&
                      searchQuery && (
                        <CommandEmpty>
                          لم يتم العثور على نتائج لـ &quot;{searchQuery}&quot;
                        </CommandEmpty>
                      )}

                    {!isSearching && searchResults.length > 0 && (
                      <CommandGroup
                        heading={`النتائج (${searchResults.length})`}
                      >
                        {searchResults.slice(0, 8).map((ad) => (
                          <CommandItem
                            key={ad.id}
                            onSelect={() => handleAdClick(ad)}
                            className="cursor-pointer p-3 group focus-visible:!outline-none"
                          >
                            <Link
                              href={`/ads/${ad.id}`}
                              className="flex items-center gap-3 w-full"
                            >
                              {/* Ad Image */}
                              <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                                {ad.image ? (
                                  <Image
                                    src={ad.image}
                                    alt={ad.title}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-xs text-gray-500">
                                    صورة
                                  </div>
                                )}
                              </div>

                              {/* Ad Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-sm font-medium truncate">
                                    {ad.title}
                                  </h4>
                                  <span className="text-sm font-bold text-primary group-hover:text-white flex-shrink-0">
                                    {ad.price.toLocaleString("ar")}{" "}
                                    {ad.currency === "USD"
                                      ? "$"
                                      : ad.currency === "SAR"
                                      ? "ر.س"
                                      : ad.currency}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground group-hover:text-white">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 group-hover:text-white" />
                                    <span className="truncate max-w-[8rem]">
                                      {ad.location}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xs">
                                      {ad.sellerImage ? (
                                        <Image
                                          src={ad.sellerImage}
                                          alt={ad.seller}
                                          width={16}
                                          height={16}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <span className="text-[8px]">
                                          {getInitials(ad.seller)}
                                        </span>
                                      )}
                                    </div>
                                    <span className="truncate max-w-[6rem]">
                                      {ad.seller}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </CommandItem>
                        ))}

                        {searchResults.length > 8 && (
                          <CommandItem
                            onSelect={handleSearch}
                            className="text-center text-sm text-primary cursor-pointer"
                          >
                            عرض جميع النتائج ({searchResults.length})
                          </CommandItem>
                        )}
                      </CommandGroup>
                    )}
                  </>
                )}

                {/* No query state */}
                {!searchQuery && recentSearches.length === 0 && (
                  <CommandGroup>
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <SearchIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <div className="text-sm text-muted-foreground">
                        ابدأ الكتابة للبحث عن الإعلانات
                      </div>
                    </div>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </div>
        )}
      </div>

      <Button
        size="lg"
        className="rounded-tr-none rounded-br-none h-12"
        onClick={handleSearch}
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

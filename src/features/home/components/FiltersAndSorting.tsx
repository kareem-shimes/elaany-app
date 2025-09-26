"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Filter, SortAsc, MapPin, DollarSign, Clock, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export interface FilterOptions {
  priceRange: {
    min?: number;
    max?: number;
  };
  location: string[];
  condition: string[];
  featured: boolean;
}

export interface SortOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface FiltersAndSortingProps {
  totalResults: number;
}

const sortOptions: SortOption[] = [
  {
    label: "تلقائي",
    value: "auto",
    icon: <SortAsc className="h-4 w-4 text-inherit group-hover:text-white" />,
  },
  {
    label: "الأحدث",
    value: "newest",
    icon: <Clock className="h-4 w-4 text-inherit group-hover:text-white" />,
  },
  {
    label: "الأقدم",
    value: "oldest",
    icon: <Clock className="h-4 w-4 text-inherit group-hover:text-white" />,
  },
  {
    label: "السعر: من الأقل للأعلى",
    value: "price-low",
    icon: (
      <DollarSign className="h-4 w-4 text-inherit group-hover:text-white" />
    ),
  },
  {
    label: "السعر: من الأعلى للأقل",
    value: "price-high",
    icon: (
      <DollarSign className="h-4 w-4 text-inherit group-hover:text-white" />
    ),
  },
  {
    label: "الأكثر شعبية",
    value: "popular",
    icon: <Star className="h-4 w-4 text-inherit group-hover:text-white" />,
  },
];

const priceRanges = [
  { label: "أقل من 500 ر.س", min: 0, max: 500 },
  { label: "500 - 1000 ر.س", min: 500, max: 1000 },
  { label: "1000 - 5000 ر.س", min: 1000, max: 5000 },
  { label: "5000 - 10000 ر.س", min: 5000, max: 10000 },
  { label: "أكثر من 10000 ر.س", min: 10000, max: undefined },
];

const locations = [
  "الرياض",
  "جدة",
  "الدمام",
  "مكة المكرمة",
  "المدينة المنورة",
  "الخبر",
  "تبوك",
  "أبها",
];

const conditions = ["جديد", "ممتاز", "جيد جداً", "جيد", "مقبول"];

export default function FiltersAndSorting({
  totalResults,
}: FiltersAndSortingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current values from URL
  const currentSort = searchParams.get("sortBy") || "auto";
  const currentLocations = searchParams.getAll("location");
  const currentConditions = searchParams.getAll("condition");
  const currentFeatured = searchParams.get("featured") === "true";
  const currentMinPrice = searchParams.get("minPrice");
  const currentMaxPrice = searchParams.get("maxPrice");

  const selectedSortOption = sortOptions.find(
    (option) => option.value === currentSort
  );

  const hasActiveFilters =
    currentLocations.length > 0 ||
    currentConditions.length > 0 ||
    currentFeatured ||
    currentMinPrice ||
    currentMaxPrice;

  // Helper function to update URL search params
  const updateSearchParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.delete(key);
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      });

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleLocationToggle = (location: string) => {
    const newLocations = currentLocations.includes(location)
      ? currentLocations.filter((l: string) => l !== location)
      : [...currentLocations, location];

    updateSearchParams({
      location: newLocations.length > 0 ? newLocations : null,
    });
  };

  const handleConditionToggle = (condition: string) => {
    const newConditions = currentConditions.includes(condition)
      ? currentConditions.filter((c: string) => c !== condition)
      : [...currentConditions, condition];

    updateSearchParams({
      condition: newConditions.length > 0 ? newConditions : null,
    });
  };

  const handlePriceRangeSelect = (range: (typeof priceRanges)[0]) => {
    updateSearchParams({
      minPrice: range.min !== undefined ? range.min.toString() : null,
      maxPrice: range.max !== undefined ? range.max.toString() : null,
    });
  };

  const handleSortChange = (sortValue: string) => {
    updateSearchParams({ sortBy: sortValue });
  };

  const handleFeaturedToggle = () => {
    updateSearchParams({ featured: currentFeatured ? null : "true" });
  };

  const handleClearFilters = () => {
    updateSearchParams({
      location: null,
      condition: null,
      featured: null,
      minPrice: null,
      maxPrice: null,
    });
  };

  return (
    <div className="bg-background border-b border-border">
      <div className="container py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            عرض {totalResults.toLocaleString()} إعلان
          </div>

          {/* Filters and Sort */}
          <div className="flex items-center gap-3">
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <div className="flex flex-wrap gap-1">
                  {currentLocations.map((location: string) => (
                    <Badge
                      key={location}
                      variant="secondary"
                      className="text-xs"
                    >
                      {location}
                    </Badge>
                  ))}
                  {currentConditions.map((condition: string) => (
                    <Badge
                      key={condition}
                      variant="secondary"
                      className="text-xs"
                    >
                      {condition}
                    </Badge>
                  ))}
                  {currentFeatured && (
                    <Badge variant="secondary" className="text-xs">
                      مميز
                    </Badge>
                  )}
                  {(currentMinPrice || currentMaxPrice) && (
                    <Badge variant="secondary" className="text-xs">
                      {currentMinPrice || 0} - {currentMaxPrice || "∞"} ر.س
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs h-6 px-2"
                >
                  مسح الكل
                </Button>
              </div>
            )}

            <Separator orientation="vertical" className="h-6" />

            {/* Filters Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  فلترة
                  {hasActiveFilters && (
                    <Badge
                      variant="destructive"
                      className="text-xs px-1 py-0 ml-1"
                    >
                      !
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {/* Price Range */}
                <div className="p-2">
                  <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    نطاق السعر
                  </h4>
                  {priceRanges.map((range, index) => {
                    const isSelected =
                      currentMinPrice &&
                      parseInt(currentMinPrice) === range.min &&
                      (currentMaxPrice
                        ? parseInt(currentMaxPrice) === range.max
                        : range.max === undefined);

                    return (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => handlePriceRangeSelect(range)}
                        className={`text-sm ${
                          isSelected ? "bg-accent text-white" : ""
                        }`}
                      >
                        {range.label}
                        {isSelected && <span className="ml-auto">✓</span>}
                      </DropdownMenuItem>
                    );
                  })}
                </div>

                <DropdownMenuSeparator />

                {/* Location */}
                <div className="p-2">
                  <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    المدينة
                  </h4>
                  {locations.map((location) => (
                    <DropdownMenuItem
                      key={location}
                      onClick={() => handleLocationToggle(location)}
                      className={`text-sm ${
                        currentLocations.includes(location)
                          ? "bg-accent text-white"
                          : ""
                      }`}
                    >
                      {location}
                      {currentLocations.includes(location) && (
                        <span className="ml-auto">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>

                <DropdownMenuSeparator />

                {/* Condition */}
                <div className="p-2">
                  <h4 className="font-medium mb-2 text-sm">الحالة</h4>
                  {conditions.map((condition) => (
                    <DropdownMenuItem
                      key={condition}
                      onClick={() => handleConditionToggle(condition)}
                      className={`text-sm ${
                        currentConditions.includes(condition)
                          ? "bg-accent text-white"
                          : ""
                      }`}
                    >
                      {condition}
                      {currentConditions.includes(condition) && (
                        <span className="ml-auto">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>

                <DropdownMenuSeparator />

                {/* Featured */}
                <DropdownMenuItem
                  onClick={handleFeaturedToggle}
                  className={`text-sm ${
                    currentFeatured ? "bg-accent text-white" : ""
                  }`}
                >
                  <Star
                    className={`h-4 w-4 ml-2 ${
                      currentFeatured ? "text-white" : ""
                    }`}
                  />
                  إعلانات مميزة فقط
                  {currentFeatured && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {selectedSortOption?.icon || <SortAsc className="h-4 w-4" />}
                  ترتيب: {selectedSortOption?.label || "تلقائي"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`gap-2 group ${
                      currentSort === option.value ? "bg-accent text-white" : ""
                    }`}
                  >
                    <span
                      className={`group-hover:text-white ${
                        currentSort === option.value
                          ? "text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      {option.icon}
                    </span>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

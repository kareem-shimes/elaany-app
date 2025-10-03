"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortAsc, MapPin, DollarSign, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export interface FilterOptions {
  priceRange: {
    min?: number;
    max?: number;
  };
  location: string[];
}

export interface SortOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface SearchParams {
  page?: string;
  category?: string;
  subcategory?: string;
  location?: string | string[];
  country?: string | string[];
  query?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  sortBy?: string;
}

interface FiltersAndSortingProps {
  searchParams: SearchParams;
}

const sortOptions: SortOption[] = [
  {
    label: "تلقائي",
    value: "auto",
    icon: <SortAsc className="h-4 w-4 text-inherit group-hover:text-white" />,
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

const countriesData = {
  السعودية: [
    "الرياض",
    "جدة",
    "الدمام",
    "مكة المكرمة",
    "المدينة المنورة",
    "الخبر",
    "تبوك",
    "أبها",
    "الطائف",
    "بريدة",
    "خميس مشيط",
    "الهفوف",
  ],
  الإمارات: [
    "دبي",
    "أبو ظبي",
    "الشارقة",
    "العين",
    "عجمان",
    "رأس الخيمة",
    "الفجيرة",
    "أم القيوين",
  ],
  الكويت: ["الكويت", "الأحمدي", "حولي", "الفروانية", "مبارك الكبير", "الجهراء"],
  قطر: ["الدوحة", "الريان", "الوكرة", "أم صلال", "الخور", "الدعين"],
  البحرين: ["المنامة", "المحرق", "الرفاع", "مدينة حمد", "مدينة عيسى", "سترة"],
  عمان: ["مسقط", "صلالة", "نزوى", "صحار", "الرستاق", "صور"],
};

export default function FiltersAndSorting({
  searchParams,
}: FiltersAndSortingProps) {
  const router = useRouter();

  // Handle multiple locations and countries from searchParams
  const locations = Array.isArray(searchParams.location)
    ? searchParams.location
    : searchParams.location
    ? [searchParams.location]
    : [];

  const countries = Array.isArray(searchParams.country)
    ? searchParams.country
    : searchParams.country
    ? [searchParams.country]
    : [];

  // Get current values from searchParams
  const currentSort = searchParams.sortBy || "auto";
  const currentLocations = locations;
  const currentCountries = countries;
  const currentMinPrice = searchParams.minPrice;
  const currentMaxPrice = searchParams.maxPrice;

  const selectedSortOption = sortOptions.find(
    (option) => option.value === currentSort
  );

  const hasActiveFilters =
    currentLocations.length > 0 ||
    currentCountries.length > 0 ||
    currentMinPrice ||
    currentMaxPrice;

  // Helper function to update URL search params
  const updateSearchParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams();

      // Start with current searchParams
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else {
            params.set(key, value);
          }
        }
      });

      // Apply updates
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
    if (location === "الكل") {
      // If selecting "الكل", replace all previous city selections
      updateSearchParams({
        location: ["الكل"],
      });
    } else {
      // If selecting a specific city, remove "الكل" if it exists
      let newLocations = currentLocations.filter((l) => l !== "الكل");

      if (newLocations.includes(location)) {
        // Remove the location if it's already selected
        newLocations = newLocations.filter((l: string) => l !== location);
      } else {
        // Add the location
        newLocations = [...newLocations, location];
      }

      updateSearchParams({
        location: newLocations.length > 0 ? newLocations : null,
      });
    }
  };

  const handleCountryToggle = (country: string) => {
    if (country === "كل المناطق") {
      // If selecting "كل المناطق", replace all previous selections
      updateSearchParams({
        country: ["كل المناطق"],
        location: null, // Clear city selections when selecting all regions
      });
    } else {
      // If selecting a specific country, remove "كل المناطق" if it exists
      let newCountries = currentCountries.filter((c) => c !== "كل المناطق");

      if (newCountries.includes(country)) {
        // Remove the country if it's already selected
        newCountries = newCountries.filter((c: string) => c !== country);
      } else {
        // Add the country
        newCountries = [...newCountries, country];
      }

      updateSearchParams({
        country: newCountries.length > 0 ? newCountries : null,
      });
    }
  };

  const handlePriceRangeSelect = (range: (typeof priceRanges)[0]) => {
    updateSearchParams({
      minPrice: range.min !== undefined ? range.min.toString() : null,
      maxPrice: range.max !== undefined ? range.max.toString() : null,
    });
  };

  const handleSortChange = (sortValue: string) => {
    // If sorting by "auto" (default), remove the sortBy parameter entirely
    if (sortValue === "auto") {
      updateSearchParams({ sortBy: null });
    } else {
      updateSearchParams({ sortBy: sortValue });
    }
  };

  const handleClearFilters = () => {
    updateSearchParams({
      location: null,
      country: null,
      minPrice: null,
      maxPrice: null,
    });
  };

  const getCurrentPriceLabel = () => {
    if (!currentMinPrice && !currentMaxPrice) return "السعر";
    const range = priceRanges.find(
      (r) =>
        r.min.toString() === currentMinPrice &&
        (r.max?.toString() === currentMaxPrice || (!r.max && !currentMaxPrice))
    );
    return range
      ? range.label
      : `${currentMinPrice || 0} - ${currentMaxPrice || "∞"} ر.س`;
  };

  const getCurrentCountryLabel = () => {
    if (currentCountries.length === 0) return "الدولة";
    if (currentCountries.length === 1) return currentCountries[0];
    return `${currentCountries.length} دول`;
  };

  const getCurrentCityLabel = () => {
    if (currentLocations.length === 0) return "المدينة";
    if (currentLocations.length === 1) return currentLocations[0];
    return `${currentLocations.length} مدن`;
  };

  // Get available cities based on selected countries
  const getAvailableCities = () => {
    if (
      currentCountries.length === 0 ||
      currentCountries.includes("كل المناطق")
    ) {
      return []; // Don't show cities if no country selected or "كل المناطق" is selected
    }
    let cities: string[] = [];
    currentCountries.forEach((country: string) => {
      if (countriesData[country as keyof typeof countriesData]) {
        cities = [
          ...cities,
          ...countriesData[country as keyof typeof countriesData],
        ];
      }
    });
    return [...new Set(cities)]; // Remove duplicates
  };

  return (
    <div className="bg-background border-b border-border">
      <div className="container py-4">
        {/* Filters and Sort */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Country Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  {getCurrentCountryLabel()}
                  {currentCountries.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="text-xs px-1 py-0 ml-1"
                    >
                      {currentCountries.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <div className="p-2">
                  <DropdownMenuItem
                    onClick={() => handleCountryToggle("كل المناطق")}
                    className={`text-sm ${
                      currentCountries.includes("كل المناطق")
                        ? "bg-accent text-white"
                        : ""
                    }`}
                  >
                    كل المناطق
                    {currentCountries.includes("كل المناطق") && (
                      <span className="ml-auto">✓</span>
                    )}
                  </DropdownMenuItem>
                  {Object.keys(countriesData).map((country) => (
                    <DropdownMenuItem
                      key={country}
                      onClick={() => handleCountryToggle(country)}
                      className={`text-sm ${
                        currentCountries.includes(country)
                          ? "bg-accent text-white"
                          : ""
                      }`}
                    >
                      {country}
                      {currentCountries.includes(country) && (
                        <span className="ml-auto">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* City Filter - Show only if specific countries are selected (not "كل المناطق") */}
            {((currentCountries.length > 0 &&
              !currentCountries.includes("كل المناطق") &&
              getAvailableCities().length > 0) ||
              currentLocations.length > 0) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    {getCurrentCityLabel()}
                    {currentLocations.length > 0 && (
                      <Badge
                        variant="destructive"
                        className="text-xs px-1 py-0 ml-1"
                      >
                        {currentLocations.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-48 max-h-64 overflow-y-auto"
                >
                  <div className="p-2">
                    <DropdownMenuItem
                      onClick={() => handleLocationToggle("الكل")}
                      className={`text-sm ${
                        currentLocations.includes("الكل")
                          ? "bg-accent text-white"
                          : ""
                      }`}
                    >
                      الكل
                      {currentLocations.includes("الكل") && (
                        <span className="ml-auto">✓</span>
                      )}
                    </DropdownMenuItem>
                    {getAvailableCities().map((city) => (
                      <DropdownMenuItem
                        key={city}
                        onClick={() => handleLocationToggle(city)}
                        className={`text-sm ${
                          currentLocations.includes(city)
                            ? "bg-accent text-white"
                            : ""
                        }`}
                      >
                        {city}
                        {currentLocations.includes(city) && (
                          <span className="ml-auto">✓</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Price Range Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <DollarSign className="h-4 w-4" />
                  {getCurrentPriceLabel()}
                  {(currentMinPrice || currentMaxPrice) && (
                    <Badge
                      variant="destructive"
                      className="text-xs px-1 py-0 ml-1"
                    >
                      !
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <div className="p-2">
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
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs px-2"
              >
                مسح الكل
              </Button>
            )}
          </div>

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
  );
}

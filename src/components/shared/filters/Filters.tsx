"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  X,
  MapPin,
  DollarSign,
  Calendar,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface FilterValue {
  type: string;
  label: string;
  value: string | number | [number, number];
}

interface FiltersProps {
  onFiltersChange?: (filters: FilterValue[]) => void;
  onClearFilters?: () => void;
  className?: string;
}

export function Filters({
  onFiltersChange,
  onClearFilters,
  className = "",
}: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterValue[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("");
  const [sortBy, setSortBy] = useState("");

  const conditions = [
    { value: "new", label: "New" },
    { value: "used", label: "Used" },
    { value: "refurbished", label: "Refurbished" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  const applyFilters = () => {
    const filters: FilterValue[] = [];

    if (location) {
      filters.push({
        type: "location",
        label: `Location: ${location}`,
        value: location,
      });
    }

    if (priceRange[0] > 0 || priceRange[1] < 10000) {
      filters.push({
        type: "price",
        label: `$${priceRange[0]} - $${priceRange[1]}`,
        value: priceRange,
      });
    }

    if (condition) {
      const conditionLabel =
        conditions.find((c) => c.value === condition)?.label || condition;
      filters.push({
        type: "condition",
        label: `Condition: ${conditionLabel}`,
        value: condition,
      });
    }

    if (sortBy) {
      const sortLabel =
        sortOptions.find((s) => s.value === sortBy)?.label || sortBy;
      filters.push({
        type: "sort",
        label: `Sort: ${sortLabel}`,
        value: sortBy,
      });
    }

    setActiveFilters(filters);
    onFiltersChange?.(filters);
    setIsOpen(false);
  };

  const removeFilter = (filterToRemove: FilterValue) => {
    const newFilters = activeFilters.filter(
      (filter) =>
        filter.type !== filterToRemove.type ||
        filter.value !== filterToRemove.value
    );
    setActiveFilters(newFilters);
    onFiltersChange?.(newFilters);

    // Reset the corresponding state
    if (filterToRemove.type === "location") setLocation("");
    if (filterToRemove.type === "price") setPriceRange([0, 10000]);
    if (filterToRemove.type === "condition") setCondition("");
    if (filterToRemove.type === "sort") setSortBy("");
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setPriceRange([0, 10000]);
    setLocation("");
    setCondition("");
    setSortBy("");
    onClearFilters?.();
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilters.length}
            </Badge>
          )}
        </Button>

        {activeFilters.length > 0 && (
          <Button variant="ghost" onClick={clearAllFilters} className="text-sm">
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {filter.label}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => removeFilter(filter)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Panel */}
      {isOpen && (
        <div className="bg-white border rounded-lg p-4 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location Filter */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </Label>
              <Input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Price Range</span>
              </Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                />
              </div>
            </div>

            {/* Condition Filter */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Condition</span>
              </Label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any condition</option>
                {conditions.map((cond) => (
                  <option key={cond.value} value={cond.value}>
                    {cond.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Sort By</span>
              </Label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Default</option>
                {sortOptions.map((sort) => (
                  <option key={sort.value} value={sort.value}>
                    {sort.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </div>
      )}
    </div>
  );
}

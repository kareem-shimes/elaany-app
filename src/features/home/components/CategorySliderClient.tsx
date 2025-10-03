"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Smartphone,
  Home,
  Sofa,
  Dumbbell,
  Shirt,
  Grid3x3,
  Monitor,
  Gamepad2,
  Book,
  Baby,
  Briefcase,
  Heart,
  Music,
  Camera,
  Hammer,
  GraduationCap,
  LucideIcon,
} from "lucide-react";
import { useKeenSlider } from "keen-slider/react";
import { useRouter, useSearchParams } from "next/navigation";
import "keen-slider/keen-slider.min.css";
import { cn } from "@/lib/utils";

// Icon mapping for client-side icon resolution
const iconComponents: Record<string, LucideIcon> = {
  Car,
  Smartphone,
  Home,
  Sofa,
  Dumbbell,
  Shirt,
  Grid3x3,
  Monitor,
  Gamepad2,
  Book,
  Baby,
  Briefcase,
  Heart,
  Music,
  Camera,
  Hammer,
  GraduationCap,
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  subcategories?: Subcategory[];
  adsCount?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

interface CategorySliderClientProps {
  categories: Category[];
}

export default function CategorySliderClient({
  categories,
}: CategorySliderClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current category and subcategory from URL
  const currentCategorySlug = searchParams.get("category");
  const currentSubcategorySlug = searchParams.get("subcategory");

  // Find current category by slug, default to "all"
  const selectedCategory = currentCategorySlug || "all";
  const selectedSubcategory = currentSubcategorySlug || undefined;

  // Helper function to update URL parameters
  const updateUrlParams = (category?: string, subcategory?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset page when changing filters
    params.delete("page");

    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    if (subcategory) {
      params.set("subcategory", subcategory);
    } else {
      params.delete("subcategory");
    }

    const newUrl = params.toString() ? `/?${params.toString()}` : "/";
    router.push(newUrl);
  };

  // Keen slider for main categories
  const [sliderRef] = useKeenSlider({
    mode: "free-snap",
    rtl: true,
    slides: {
      perView: 4,
      spacing: 8,
    },
    breakpoints: {
      "(min-width: 1024px)": {
        slides: {
          perView: 6,
          spacing: 16,
        },
      },
      "(min-width: 1280px)": {
        slides: {
          perView: 8,
          spacing: 20,
        },
      },
    },
  });

  // Keen slider for subcategories
  const [subcategorySliderRef] = useKeenSlider({
    mode: "free-snap",
    rtl: true,
    slides: {
      perView: 3,
      spacing: 8,
    },
    breakpoints: {
      "(min-width: 1024px)": {
        slides: {
          perView: 6,
          spacing: 16,
        },
      },
      "(min-width: 1280px)": {
        slides: {
          perView: 8,
          spacing: 20,
        },
      },
    },
  });

  const currentCategory = categories.find(
    (cat) => cat.slug === selectedCategory
  );
  const hasSubcategories =
    currentCategory?.subcategories && currentCategory.subcategories.length > 0;

  const handleSubcategoryChange = (subcategorySlug: string | undefined) => {
    updateUrlParams(selectedCategory, subcategorySlug);
  };

  const handleCategoryChange = (categorySlug: string) => {
    updateUrlParams(categorySlug, undefined);
  };

  return (
    <div className="container space-y-2">
      <div ref={sliderRef} className="keen-slider">
        {categories.map((category) => {
          const IconComponent = category.iconName
            ? iconComponents[category.iconName]
            : Grid3x3;
          return (
            <div key={category.id} className="keen-slider__slide">
              <Button
                variant={
                  selectedCategory === category.slug ? "default" : "outline"
                }
                size="sm"
                onClick={() => {
                  handleCategoryChange(category.slug);
                }}
                className={cn(
                  "whitespace-nowrap border-none w-full py-10 flex flex-col items-center transition-colors duration-150 rounded-lg",
                  selectedCategory === category.slug
                    ? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                    : "bg-transparent text-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                {IconComponent && (
                  <IconComponent
                    className={cn(
                      "!h-6 !w-6 transition-colors duration-150",
                      selectedCategory === category.slug
                        ? "text-primary"
                        : "text-primary"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "mt-1 text-sm transition-all",
                    selectedCategory === category.slug
                      ? "font-semibold text-primary"
                      : "font-normal"
                  )}
                >
                  {category.name}
                </span>
              </Button>
            </div>
          );
        })}
      </div>

      {/* Subcategories */}
      {hasSubcategories && (
        <div className="border-t border-border bg-muted/30 p-2">
          <div
            key={selectedCategory}
            ref={subcategorySliderRef}
            className="keen-slider"
          >
            <div className="keen-slider__slide">
              <Button
                variant={!selectedSubcategory ? "default" : "ghost"}
                size="sm"
                onClick={() => handleSubcategoryChange(undefined)}
                className={cn(
                  "whitespace-nowrap !w-full text-xs gap-1 px-3 py-1 rounded-md transition-all duration-150",
                  !selectedSubcategory
                    ? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                    : "bg-transparent text-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                الكل
              </Button>
            </div>
            {currentCategory?.subcategories?.map((subcategory) => (
              <div key={subcategory.slug} className="keen-slider__slide">
                <Button
                  variant={
                    selectedSubcategory === subcategory.slug
                      ? "default"
                      : "ghost"
                  }
                  size="sm"
                  onClick={() => handleSubcategoryChange(subcategory.slug)}
                  className={cn(
                    "whitespace-nowrap !w-full text-xs gap-1 px-3 py-1 rounded-md transition-all duration-150",
                    selectedSubcategory === subcategory.slug
                      ? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                      : "bg-transparent text-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {subcategory.name}
                  {subcategory.count && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-1 py-0 ml-2"
                    >
                      {subcategory.count}
                    </Badge>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
} from "lucide-react";
import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { cn } from "@/lib/utils";

export interface Category {
  id: string;
  name: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  count?: number;
}

const categories: Category[] = [
  {
    id: "all",
    name: "الكل",
    icon: Grid3x3,
    subcategories: [],
  },
  {
    id: "cars",
    name: "سيارات",
    icon: Car,
    subcategories: [
      { id: "sedan", name: "سيدان", count: 150 },
      { id: "suv", name: "دفع رباعي", count: 89 },
      { id: "hatchback", name: "هاتشباك", count: 45 },
      { id: "pickup", name: "بك أب", count: 67 },
      { id: "luxury", name: "سيارات فاخرة", count: 23 },
      { id: "motorcycles", name: "دراجات نارية", count: 34 },
    ],
  },
  {
    id: "electronics",
    name: "إلكترونيات",
    icon: Smartphone,
    subcategories: [
      { id: "phones", name: "هواتف ذكية", count: 234 },
      { id: "laptops", name: "لابتوب", count: 123 },
      { id: "tablets", name: "تابلت", count: 67 },
      { id: "cameras", name: "كاميرات", count: 45 },
      { id: "gaming", name: "ألعاب إلكترونية", count: 89 },
      { id: "accessories", name: "اكسسوارات", count: 156 },
    ],
  },
  {
    id: "real-estate",
    name: "عقارات",
    icon: Home,
    subcategories: [
      { id: "apartments", name: "شقق للإيجار", count: 345 },
      { id: "houses-rent", name: "فلل للإيجار", count: 123 },
      { id: "apartments-sale", name: "شقق للبيع", count: 234 },
      { id: "houses-sale", name: "فلل للبيع", count: 167 },
      { id: "commercial", name: "عقارات تجارية", count: 78 },
      { id: "land", name: "أراضي", count: 89 },
    ],
  },
  {
    id: "furniture",
    name: "أثاث",
    icon: Sofa,
    subcategories: [
      { id: "bedroom", name: "غرف نوم", count: 123 },
      { id: "living-room", name: "صالات", count: 89 },
      { id: "dining", name: "غرف طعام", count: 67 },
      { id: "office", name: "مكاتب", count: 45 },
      { id: "kitchen", name: "مطابخ", count: 78 },
      { id: "outdoor", name: "أثاث خارجي", count: 34 },
    ],
  },
  {
    id: "sports",
    name: "رياضة",
    icon: Dumbbell,
    subcategories: [
      { id: "fitness", name: "لياقة بدنية", count: 67 },
      { id: "bikes", name: "دراجات هوائية", count: 45 },
      { id: "football", name: "كرة قدم", count: 89 },
      { id: "swimming", name: "سباحة", count: 34 },
      { id: "gym", name: "معدات جيم", count: 56 },
      { id: "outdoor-sports", name: "رياضات خارجية", count: 23 },
    ],
  },
  {
    id: "fashion",
    name: "أزياء",
    icon: Shirt,
    subcategories: [
      { id: "men-clothing", name: "ملابس رجالية", count: 145 },
      { id: "women-clothing", name: "ملابس نسائية", count: 234 },
      { id: "shoes", name: "أحذية", count: 123 },
      { id: "bags", name: "حقائب", count: 78 },
      { id: "accessories", name: "اكسسوارات", count: 89 },
      { id: "watches", name: "ساعات", count: 56 },
    ],
  },
];

export default function CategorySlider() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    string | undefined
  >();

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

  const currentCategory = categories.find((cat) => cat.id === selectedCategory);
  const hasSubcategories =
    currentCategory?.subcategories && currentCategory.subcategories.length > 0;

  const handleSubcategoryChange = (subcategoryId: string | undefined) => {
    setSelectedSubcategory(subcategoryId);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Always reset subcategory when changing main category
    setSelectedSubcategory(undefined);
  };

  return (
    <div className="container space-y-2">
      <div ref={sliderRef} className="keen-slider">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div key={category.id} className="keen-slider__slide">
              <Button
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => {
                  handleCategoryChange(category.id);
                }}
                className={cn(
                  "whitespace-nowrap border-none w-full py-10 flex flex-col items-center transition-colors duration-150 rounded-lg",
                  selectedCategory === category.id
                    ? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                    : "bg-transparent text-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                {IconComponent && (
                  <IconComponent
                    className={cn(
                      "!h-6 !w-6 transition-colors duration-150",
                      selectedCategory === category.id
                        ? "text-primary"
                        : "text-primary"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "mt-1 text-sm transition-all",
                    selectedCategory === category.id
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
              <div key={subcategory.id} className="keen-slider__slide">
                <Button
                  variant={
                    selectedSubcategory === subcategory.id ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => handleSubcategoryChange(subcategory.id)}
                  className={cn(
                    "whitespace-nowrap !w-full text-xs gap-1 px-3 py-1 rounded-md transition-all duration-150",
                    selectedSubcategory === subcategory.id
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

export { categories };

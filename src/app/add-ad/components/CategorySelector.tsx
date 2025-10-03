"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Home,
  Smartphone,
  Sofa,
  Dumbbell,
  Shirt,
  ChevronRight,
  ArrowRight,
  Building,
  Key,
  ShoppingCart,
} from "lucide-react";
import CarAdForm from "./CarAdForm";
import RealEstateAdForm from "./RealEstateAdForm";
import GeneralAdForm from "./GeneralAdForm";

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

interface CategorySelectorProps {
  categories: Category[];
}

interface AdType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  categorySlug: string;
  available: boolean;
  subcategories?: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
}

export default function CategorySelector({
  categories,
}: CategorySelectorProps) {
  const [selectedAdType, setSelectedAdType] = useState<string | null>(null);

  const adTypes: AdType[] = [
    {
      id: "cars",
      title: "السيارات",
      description: "بيع وإيجار السيارات المستعملة والجديدة",
      icon: <Car className="h-8 w-8" />,
      categorySlug: "cars",
      available: true,
      subcategories: [
        {
          id: "car-sale",
          title: "بيع سيارة",
          description: "عرض سيارة للبيع",
          icon: <ShoppingCart className="h-5 w-5" />,
        },
        {
          id: "car-rent",
          title: "تأجير سيارة",
          description: "عرض سيارة للإيجار",
          icon: <Key className="h-5 w-5" />,
        },
      ],
    },
    {
      id: "real-estate",
      title: "العقارات",
      description: "بيع وإيجار الشقق والفلل والأراضي",
      icon: <Home className="h-8 w-8" />,
      categorySlug: "real-estate",
      available: true,
      subcategories: [
        {
          id: "real-estate-sale",
          title: "بيع عقار",
          description: "عرض عقار للبيع",
          icon: <Building className="h-5 w-5" />,
        },
        {
          id: "real-estate-rent",
          title: "تأجير عقار",
          description: "عرض عقار للإيجار",
          icon: <Key className="h-5 w-5" />,
        },
      ],
    },
    {
      id: "electronics",
      title: "الإلكترونيات",
      description: "هواتف، لابتوب، أجهزة إلكترونية",
      icon: <Smartphone className="h-8 w-8" />,
      categorySlug: "electronics",
      available: false,
    },
    {
      id: "furniture",
      title: "الأثاث",
      description: "أثاث منزلي ومكتبي",
      icon: <Sofa className="h-8 w-8" />,
      categorySlug: "furniture",
      available: false,
    },
    {
      id: "sports",
      title: "الرياضة",
      description: "أجهزة رياضية ومعدات اللياقة",
      icon: <Dumbbell className="h-8 w-8" />,
      categorySlug: "sports",
      available: false,
    },
    {
      id: "fashion",
      title: "الأزياء",
      description: "ملابس رجالية ونسائية وإكسسوارات",
      icon: <Shirt className="h-8 w-8" />,
      categorySlug: "fashion",
      available: false,
    },
  ];

  const availableAdTypes = adTypes.filter((type) => type.available);

  const handleAdTypeSelect = (adTypeId: string) => {
    const selectedType = adTypes.find((type) => type.id === adTypeId);
    if (selectedType?.subcategories) {
      // If the ad type has subcategories, set the first one as default
      setSelectedAdType(selectedType.subcategories[0].id);
    } else {
      setSelectedAdType(adTypeId);
    }
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedAdType(subcategoryId);
  };

  const handleBackToSelection = () => {
    setSelectedAdType(null);
  };

  const getSelectedCategory = (categorySlug: string) => {
    return categories.find((cat) => cat.slug === categorySlug);
  };

  // If an ad type is selected, show the corresponding form
  if (selectedAdType) {
    // Find the parent category for the selected ad type
    let categorySlug = "";
    let isRental = false;

    if (selectedAdType === "car-sale" || selectedAdType === "car-rent") {
      categorySlug = "cars";
      isRental = selectedAdType === "car-rent";
    } else if (
      selectedAdType === "real-estate-sale" ||
      selectedAdType === "real-estate-rent"
    ) {
      categorySlug = "real-estate";
      isRental = selectedAdType === "real-estate-rent";
    } else {
      // For other categories, find the category slug
      const adType = adTypes.find((type) => type.id === selectedAdType);
      categorySlug = adType?.categorySlug || "";
    }

    const category = getSelectedCategory(categorySlug);

    if (!category) {
      console.error("Category not found:", categorySlug);
      return (
        <div className="text-center p-8">
          <p className="text-red-600 mb-4">
            خطأ: لم يتم العثور على الفئة المطلوبة
          </p>
          <Button onClick={handleBackToSelection}>العودة للاختيار</Button>
        </div>
      );
    }

    if (selectedAdType === "car-sale" || selectedAdType === "car-rent") {
      return (
        <CarAdForm
          category={category}
          onBack={handleBackToSelection}
          isRental={isRental}
        />
      );
    }

    if (
      selectedAdType === "real-estate-sale" ||
      selectedAdType === "real-estate-rent"
    ) {
      return (
        <RealEstateAdForm
          category={category}
          onBack={handleBackToSelection}
          isRental={isRental}
        />
      );
    }

    // For other categories, use general form
    return <GeneralAdForm category={category} onBack={handleBackToSelection} />;
  }

  // Show category selection
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Categories - Left/Center */}
      <div className="lg:col-span-2 space-y-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إنشاء إعلان جديد
          </h1>
          <p className="text-gray-600">اختر نوع الإعلان الذي تريد إنشاؤه</p>
        </div>

        {/* Available Categories */}
        <div className="space-y-4">
          {availableAdTypes.map((adType) => (
            <CategoryCard
              key={adType.id}
              adType={adType}
              onSelect={handleAdTypeSelect}
              onSubcategorySelect={handleSubcategorySelect}
            />
          ))}
        </div>

        {/* Coming Soon Badge */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            المزيد قريباً
            <Badge variant="secondary">قريباً</Badge>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adTypes
              .filter((type) => !type.available)
              .map((adType) => (
                <Card key={adType.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400">{adType.icon}</div>
                      <div>
                        <h4 className="font-medium text-gray-500">
                          {adType.title}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {adType.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Card Component
interface CategoryCardProps {
  adType: AdType;
  onSelect: (adTypeId: string) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
}

function CategoryCard({
  adType,
  onSelect,
  onSubcategorySelect,
}: CategoryCardProps) {
  const [showSubcategories, setShowSubcategories] = useState(false);

  const handleCardClick = () => {
    if (adType.subcategories && adType.subcategories.length > 0) {
      setShowSubcategories(!showSubcategories);
    } else {
      onSelect(adType.id);
    }
  };

  return (
    <Card className="border-2 hover:border-blue-300 transition-all duration-200">
      <CardContent className="p-0">
        <div
          className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleCardClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-blue-600">{adType.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {adType.title}
                </h3>
                <p className="text-gray-600">{adType.description}</p>
              </div>
            </div>
            <ChevronRight
              className={`h-5 w-5 text-gray-400 transition-transform ${
                showSubcategories && adType.subcategories ? "rotate-90" : ""
              }`}
            />
          </div>
        </div>

        {/* Subcategories */}
        {showSubcategories && adType.subcategories && (
          <div className="border-t bg-gray-50">
            <div className="p-4 space-y-2">
              {adType.subcategories.map((subcategory) => (
                <Button
                  key={subcategory.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubcategorySelect(subcategory.id);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-blue-500">{subcategory.icon}</div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {subcategory.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {subcategory.description}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 mr-auto text-gray-400" />
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

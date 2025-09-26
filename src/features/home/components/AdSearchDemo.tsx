"use client";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Heart, MapPin, Clock, SortAsc } from "lucide-react";
import AdSearchBar from "./AdSearchBar";

// Mock ad data
const mockAds = [
  {
    id: 1,
    title: "آيفون 14 برو ماكس حالة ممتازة",
    description:
      "آيفون 14 برو ماكس 256 جيجا، حالة ممتازة جداً، مع العلبة الأصلية وجميع الملحقات",
    price: 4500,
    currency: "ر.س",
    location: "الرياض",
    category: "إلكترونيات",
    image: "/public/assets/images/products/iphone.jpg",
    postedDate: "منذ يومين",
    seller: "أحمد محمد",
    featured: true,
    condition: "ممتاز",
  },
  {
    id: 2,
    title: "سيارة كامري 2020",
    description: "تويوتا كامري 2020، فل كامل، ماشية 45 ألف كيلو، حالة ممتازة",
    price: 85000,
    currency: "ر.س",
    location: "جدة",
    category: "سيارات",
    image: "/public/assets/images/products/car.jpg",
    postedDate: "منذ أسبوع",
    seller: "سالم العتيبي",
    featured: false,
    condition: "ممتاز",
  },
  {
    id: 3,
    title: "شقة للإيجار في حي الملز",
    description: "شقة 3 غرف وصالة، مكيفة، مفروشة جزئياً، موقع ممتاز",
    price: 2500,
    currency: "ر.س/شهرياً",
    location: "الرياض - الملز",
    category: "عقارات",
    image: "/public/assets/images/products/apartment.jpg",
    postedDate: "منذ 3 أيام",
    seller: "شركة العقارات المتميزة",
    featured: true,
    condition: "جيد",
  },
  {
    id: 4,
    title: "لابتوب ديل XPS 13",
    description: "لابتوب ديل XPS 13، معالج i7، رام 16 جيجا، SSD 512 جيجا",
    price: 3200,
    currency: "ر.س",
    location: "الدمام",
    category: "إلكترونيات",
    image: "/public/assets/images/products/laptop.jpg",
    postedDate: "منذ يوم",
    seller: "فهد الشمري",
    featured: false,
    condition: "جيد جداً",
  },
  {
    id: 5,
    title: "دراجة هوائية جبلية",
    description: "دراجة هوائية جبلية، حجم 26 بوصة، 21 سرعة، حالة ممتازة",
    price: 800,
    currency: "ر.س",
    location: "الخبر",
    category: "رياضة",
    image: "/public/assets/images/products/bike.jpg",
    postedDate: "منذ 4 أيام",
    seller: "محمد الغامدي",
    featured: false,
    condition: "ممتاز",
  },
  {
    id: 6,
    title: "طاولة طعام خشبية",
    description: "طاولة طعام خشبية مع 6 كراسي، حالة جيدة جداً",
    price: 1200,
    currency: "ر.س",
    location: "مكة المكرمة",
    category: "أثاث",
    image: "/public/assets/images/products/table.jpg",
    postedDate: "منذ 5 أيام",
    seller: "نورا السلمي",
    featured: false,
    condition: "جيد",
  },
];

const categories = ["الكل", "إلكترونيات", "سيارات", "عقارات", "رياضة", "أثاث"];
const sortOptions = [
  { label: "الأحدث", value: "newest" },
  { label: "الأقدم", value: "oldest" },
  { label: "السعر: من الأقل للأعلى", value: "price-low" },
  { label: "السعر: من الأعلى للأقل", value: "price-high" },
];

export default function AdSearchDemo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [sortBy, setSortBy] = useState("newest");

  const filteredAds = useMemo(() => {
    let filtered = mockAds;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (ad) =>
          ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "الكل") {
      filtered = filtered.filter((ad) => ad.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "oldest":
        filtered = [...filtered].reverse();
        break;
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      default: // newest
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">البحث في الإعلانات</h1>
        <p className="text-muted-foreground">
          ابحث واعثر على ما تحتاجه من آلاف الإعلانات
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-8 space-y-4">
        <div className="flex justify-center">
          <AdSearchBar
            onSearch={handleSearch}
            onClear={handleClear}
            value={searchQuery}
            placeholder="ابحث عن سلعة، خدمة، عقار..."
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 justify-center">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SortAsc className="h-4 w-4" />
                ترتيب
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={sortBy === option.value ? "bg-accent" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          عرض {filteredAds.length} من {mockAds.length} إعلان
        </p>
      </div>

      {/* Ads Grid */}
      {filteredAds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-2">
            لم يتم العثور على إعلانات
          </p>
          <p className="text-sm text-muted-foreground">
            جرب تعديل كلمات البحث أو الفلاتر
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map((ad) => (
            <Card
              key={ad.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader className="p-0">
                <div className="relative">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">صورة الإعلان</span>
                  </div>
                  {ad.featured && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">
                      مميز
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 left-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <CardTitle className="text-lg line-clamp-2 mb-1">
                      {ad.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {ad.description}
                    </CardDescription>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-primary">
                      {ad.price.toLocaleString()} {ad.currency}
                    </div>
                    <Badge variant="secondary">{ad.condition}</Badge>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {ad.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {ad.postedDate}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline">{ad.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {ad.seller}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredAds.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline">تحميل المزيد من الإعلانات</Button>
        </div>
      )}
    </div>
  );
}

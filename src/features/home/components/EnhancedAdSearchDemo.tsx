"use client";
import { useState, useMemo } from "react";
import AdsToolbar from "./AdsToolbar";
import CategorySlider from "./CategorySlider";
import FiltersAndSorting, { FilterOptions } from "./FiltersAndSorting";
import AdListing, { Ad } from "./AdListing";

// Enhanced mock ad data
const mockAds: Ad[] = [
  {
    id: 1,
    title: "آيفون 14 برو ماكس حالة ممتازة",
    description:
      "آيفون 14 برو ماكس 256 جيجا، حالة ممتازة جداً، مع العلبة الأصلية وجميع الملحقات",
    price: 4500,
    currency: "ر.س",
    location: "الرياض",
    category: "إلكترونيات",
    subcategory: "هواتف ذكية",
    image: "/api/placeholder/300/200",
    postedDate: "منذ يومين",
    seller: "أحمد محمد",
    sellerId: "user1",
    featured: true,
    condition: "ممتاز",
    views: 245,
    isNegotiable: true,
    phone: "+966501234567",
  },
  {
    id: 2,
    title: "سيارة كامري 2020",
    description: "تويوتا كامري 2020، فل كامل، ماشية 45 ألف كيلو، حالة ممتازة",
    price: 85000,
    currency: "ر.س",
    location: "جدة",
    category: "سيارات",
    subcategory: "سيدان",
    image: "/api/placeholder/300/200",
    postedDate: "منذ أسبوع",
    seller: "سالم العتيبي",
    sellerId: "user2",
    featured: false,
    condition: "ممتاز",
    views: 432,
    isNegotiable: true,
    phone: "+966507654321",
  },
  {
    id: 3,
    title: "شقة للإيجار في حي الملز",
    description: "شقة 3 غرف وصالة، مكيفة، مفروشة جزئياً، موقع ممتاز",
    price: 2500,
    currency: "ر.س/شهرياً",
    location: "الرياض - الملز",
    category: "عقارات",
    subcategory: "شقق للإيجار",
    image: "/api/placeholder/300/200",
    postedDate: "منذ 3 أيام",
    seller: "شركة العقارات المتميزة",
    sellerId: "company1",
    featured: true,
    condition: "جيد",
    views: 567,
    phone: "+966112345678",
  },
  {
    id: 4,
    title: "لابتوب ديل XPS 13",
    description: "لابتوب ديل XPS 13، معالج i7، رام 16 جيجا، SSD 512 جيجا",
    price: 3200,
    currency: "ر.س",
    location: "الدمام",
    category: "إلكترونيات",
    subcategory: "لابتوب",
    image: "/api/placeholder/300/200",
    postedDate: "منذ يوم",
    seller: "فهد الشمري",
    sellerId: "user3",
    featured: false,
    condition: "جيد جداً",
    views: 123,
    isNegotiable: true,
    phone: "+966551234567",
  },
  {
    id: 5,
    title: "دراجة هوائية جبلية",
    description: "دراجة هوائية جبلية، حجم 26 بوصة، 21 سرعة، حالة ممتازة",
    price: 800,
    currency: "ر.س",
    location: "الخبر",
    category: "رياضة",
    subcategory: "دراجات هوائية",
    image: "/api/placeholder/300/200",
    postedDate: "منذ 4 أيام",
    seller: "محمد الغامدي",
    sellerId: "user4",
    featured: false,
    condition: "ممتاز",
    views: 89,
    isNegotiable: false,
    phone: "+966538765432",
  },
  {
    id: 6,
    title: "طاولة طعام خشبية",
    description: "طاولة طعام خشبية مع 6 كراسي، حالة جيدة جداً",
    price: 1200,
    currency: "ر.س",
    location: "مكة المكرمة",
    category: "أثاث",
    subcategory: "غرف طعام",
    image: "/api/placeholder/300/200",
    postedDate: "منذ 5 أيام",
    seller: "نورا السلمي",
    sellerId: "user5",
    featured: false,
    condition: "جيد",
    views: 67,
    isNegotiable: true,
    phone: "+966125678901",
  },
  {
    id: 7,
    title: "سامسونج جالاكسي S23 Ultra",
    description: "سامسونج جالاكسي S23 Ultra 512 جيجا، لون أسود، مع القلم الذكي",
    price: 3800,
    currency: "ر.س",
    location: "الرياض",
    category: "إلكترونيات",
    subcategory: "هواتف ذكية",
    image: "/api/placeholder/300/200",
    postedDate: "منذ 3 أيام",
    seller: "خالد الأحمد",
    sellerId: "user6",
    featured: true,
    condition: "جديد",
    views: 234,
    isNegotiable: false,
    phone: "+966509876543",
  },
  {
    id: 8,
    title: "سيارة لكزس ES 350",
    description: "لكزس ES 350 موديل 2019، فل كامل، حالة ممتازة، صيانات منتظمة",
    price: 125000,
    currency: "ر.س",
    location: "الرياض",
    category: "سيارات",
    subcategory: "سيارات فاخرة",
    image: "/api/placeholder/300/200",
    postedDate: "منذ يوم",
    seller: "معرض الفخامة للسيارات",
    sellerId: "dealer1",
    featured: true,
    condition: "ممتاز",
    views: 678,
    isNegotiable: true,
    phone: "+966112233445",
  },
];

export default function EnhancedAdSearchDemo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    string | undefined
  >();
  const [sortBy, setSortBy] = useState("newest");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: {},
    location: [],
    condition: [],
    featured: false,
  });

  const filteredAds = useMemo(() => {
    let filtered = mockAds;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (ad) =>
          ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.subcategory?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      const categoryMap: Record<string, string> = {
        cars: "سيارات",
        electronics: "إلكترونيات",
        "real-estate": "عقارات",
        furniture: "أثاث",
        sports: "رياضة",
        fashion: "أزياء",
      };

      const categoryName = categoryMap[selectedCategory];
      if (categoryName) {
        filtered = filtered.filter((ad) => ad.category === categoryName);
      }
    }

    // Filter by subcategory
    if (selectedSubcategory) {
      const subcategoryMap: Record<string, string> = {
        sedan: "سيدان",
        suv: "دفع رباعي",
        luxury: "سيارات فاخرة",
        phones: "هواتف ذكية",
        laptops: "لابتوب",
        apartments: "شقق للإيجار",
        bedroom: "غرف نوم",
        dining: "غرف طعام",
        bikes: "دراجات هوائية",
      };

      const subcategoryName = subcategoryMap[selectedSubcategory];
      if (subcategoryName) {
        filtered = filtered.filter((ad) => ad.subcategory === subcategoryName);
      }
    }

    // Apply filters
    if (filters.priceRange.min !== undefined) {
      filtered = filtered.filter((ad) => ad.price >= filters.priceRange.min!);
    }
    if (filters.priceRange.max !== undefined) {
      filtered = filtered.filter((ad) => ad.price <= filters.priceRange.max!);
    }
    if (filters.location.length > 0) {
      filtered = filtered.filter((ad) =>
        filters.location.some((loc) => ad.location.includes(loc))
      );
    }
    if (filters.condition.length > 0) {
      filtered = filtered.filter((ad) =>
        filters.condition.includes(ad.condition)
      );
    }
    if (filters.featured) {
      filtered = filtered.filter((ad) => ad.featured);
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
      case "popular":
        filtered = [...filtered].sort(
          (a, b) => (b.views || 0) - (a.views || 0)
        );
        break;
      default: // newest
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedSubcategory, sortBy, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleSubcategoryChange = (subcategoryId: string | undefined) => {
    setSelectedSubcategory(subcategoryId);
  };

  const handleFavoriteToggle = (adId: number) => {
    setFavorites((prev) =>
      prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
    );
  };

  const handleContactSeller = (ad: Ad) => {
    // In a real app, this would open a contact modal or redirect to messaging
    console.log("Contact seller for ad:", ad.title);
    alert(`الاتصال بـ ${ad.seller} للإعلان: ${ad.title}`);
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: {},
      location: [],
      condition: [],
      featured: false,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar */}
      <AdsToolbar
        onSearch={handleSearch}
        onClear={handleClear}
        searchValue={searchQuery}
      />

      {/* Category Slider */}
      <CategorySlider
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onCategoryChange={handleCategoryChange}
        onSubcategoryChange={handleSubcategoryChange}
      />

      {/* Filters and Sorting */}
      <FiltersAndSorting
        totalResults={filteredAds.length}
        selectedSort={sortBy}
        filters={filters}
        onSortChange={setSortBy}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Ad Listing */}
      <AdListing
        ads={filteredAds}
        onFavoriteToggle={handleFavoriteToggle}
        onContactSeller={handleContactSeller}
        favorites={favorites}
        hasMore={false} // In a real app, this would be based on pagination
      />
    </div>
  );
}

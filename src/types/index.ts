// Core types for the application

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  icon?: string;
  description?: string;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  count?: number;
}

export interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  category: string;
  subcategory?: string;
  image?: string;
  images?: string[];
  postedDate: string;
  seller: string;
  sellerId: string;
  featured: boolean;
  condition: string;
  views?: number;
  isNegotiable?: boolean;
  phone?: string;
}

export interface Filter {
  type: "price" | "location" | "condition" | "date";
  label: string;
  value: string | number | [number, number];
}

export interface SearchParams {
  query?: string;
  category?: string;
  subcategory?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sortBy?: "newest" | "oldest" | "price-low" | "price-high";
}

export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

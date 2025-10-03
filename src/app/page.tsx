import AdListingWithPagination from "@/features/home/components/AdListingWithPagination";
import AdsToolbar from "@/features/home/components/AdsToolbar";
import CategorySlider from "@/features/home/components/CategorySlider";
import FiltersAndSorting from "@/features/home/components/FiltersAndSorting";
import { getAds } from "@/lib/ads";

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

interface HomeProps {
  searchParams: Promise<SearchParams>;
}

export default async function Home({ searchParams }: HomeProps) {
  // Await the searchParams Promise (Next.js 15)
  const resolvedSearchParams = await searchParams;

  // Parse search parameters
  const page = parseInt(resolvedSearchParams.page || "1");
  const limit = 10;

  // Handle multiple locations and countries
  const locations = Array.isArray(resolvedSearchParams.location)
    ? resolvedSearchParams.location
    : resolvedSearchParams.location
    ? [resolvedSearchParams.location]
    : [];

  const countries = Array.isArray(resolvedSearchParams.country)
    ? resolvedSearchParams.country
    : resolvedSearchParams.country
    ? [resolvedSearchParams.country]
    : [];

  // Map sort values from FiltersAndSorting to getAds expected values
  const mapSortValue = (
    sortBy?: string
  ): "newest" | "oldest" | "price-low" | "price-high" => {
    switch (sortBy) {
      case "auto":
        return "newest";
      case "price-low":
        return "price-low";
      case "price-high":
        return "price-high";
      case "popular":
        return "newest"; // For now, map popular to newest
      default:
        return "newest";
    }
  };

  // Build location filter - combine countries and specific cities
  let locationFilter: string | undefined;
  if (countries.includes("كل المناطق")) {
    // If "كل المناطق" is selected, don't filter by location
    locationFilter = undefined;
  } else if (locations.includes("الكل")) {
    // If "الكل" cities is selected, filter by selected countries only
    if (countries.length > 0) {
      // Create a regex pattern that matches any of the selected countries
      locationFilter = countries.join("|");
    }
  } else if (locations.length > 0) {
    // Filter by specific cities
    locationFilter = locations.join("|");
  } else if (countries.length > 0) {
    // Filter by countries if no specific cities are selected
    locationFilter = countries.join("|");
  }

  const queryParams = {
    page,
    limit,
    category: resolvedSearchParams.category,
    subcategory: resolvedSearchParams.subcategory,
    location: locationFilter,
    query: resolvedSearchParams.query,
    minPrice: resolvedSearchParams.minPrice
      ? parseFloat(resolvedSearchParams.minPrice)
      : undefined,
    maxPrice: resolvedSearchParams.maxPrice
      ? parseFloat(resolvedSearchParams.maxPrice)
      : undefined,
    condition: resolvedSearchParams.condition,
    sortBy: mapSortValue(resolvedSearchParams.sortBy),
  };

  // Fetch ads from database
  const adsData = await getAds(queryParams);

  return (
    <main>
      <AdsToolbar />
      <CategorySlider />
      <FiltersAndSorting searchParams={resolvedSearchParams} />
      <AdListingWithPagination
        initialAds={adsData.data}
        initialHasMore={adsData.hasNext}
      />
    </main>
  );
}

import { getCategories } from "@/lib/ads";
import CategorySliderClient from "./CategorySliderClient";

// Function to get icon name for a category
function getCategoryIconName(slug: string, name: string): string {
  // Icon mapping based on category slug or common names
  const iconMap: Record<string, string> = {
    // Common category mappings
    cars: "Car",
    vehicles: "Car",
    automotive: "Car",
    electronics: "Smartphone",
    phones: "Smartphone",
    mobile: "Smartphone",
    "real-estate": "Home",
    property: "Home",
    homes: "Home",
    furniture: "Sofa",
    sports: "Dumbbell",
    fitness: "Dumbbell",
    fashion: "Shirt",
    clothing: "Shirt",
    apparel: "Shirt",
    computers: "Monitor",
    laptops: "Monitor",
    gaming: "Gamepad2",
    games: "Gamepad2",
    books: "Book",
    education: "GraduationCap",
    baby: "Baby",
    kids: "Baby",
    business: "Briefcase",
    services: "Briefcase",
    health: "Heart",
    medical: "Heart",
    music: "Music",
    audio: "Music",
    cameras: "Camera",
    photography: "Camera",
    tools: "Hammer",
    construction: "Hammer",
    // Arabic mappings
    سيارات: "Car",
    إلكترونيات: "Smartphone",
    عقارات: "Home",
    أثاث: "Sofa",
    رياضة: "Dumbbell",
    أزياء: "Shirt",
    // Default fallback
    all: "Grid3x3",
    الكل: "Grid3x3",
  };

  // Try slug first, then name (both in lowercase)
  const slugKey = slug.toLowerCase();
  const nameKey = name.toLowerCase();

  return iconMap[slugKey] || iconMap[nameKey] || "Grid3x3";
}
export default async function CategorySliderServer() {
  try {
    const categoriesData = await getCategories();

    // Transform database categories to match the client component interface
    const transformedCategories = [
      // Add "All" category at the beginning
      {
        id: "all",
        name: "الكل",
        slug: "all",
        iconName: "Grid3x3",
        subcategories: [],
        adsCount: 0,
      },
      // Transform database categories
      ...categoriesData.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        iconName: getCategoryIconName(category.slug, category.name),
        subcategories: category.subcategories.map((sub) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          count: sub.count,
        })),
        adsCount: category.adsCount,
      })),
    ];

    return <CategorySliderClient categories={transformedCategories} />;
  } catch (error) {
    console.error("Error loading categories:", error);

    // Fallback to empty state or basic categories
    const fallbackCategories = [
      {
        id: "all",
        name: "الكل",
        slug: "all",
        iconName: "Grid3x3",
        subcategories: [],
        adsCount: 0,
      },
    ];

    return <CategorySliderClient categories={fallbackCategories} />;
  }
}

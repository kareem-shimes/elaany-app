import CategorySliderServer from "./CategorySliderServer";

export default function CategorySlider() {
  return <CategorySliderServer />;
}

// Re-export types for backward compatibility
export type { Category, Subcategory } from "./CategorySliderClient";

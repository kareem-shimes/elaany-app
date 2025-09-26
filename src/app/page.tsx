import AdListing from "@/features/home/components/AdListing";
import AdsToolbar from "@/features/home/components/AdsToolbar";
import CategorySlider from "@/features/home/components/CategorySlider";
import FiltersAndSorting from "@/features/home/components/FiltersAndSorting";
import { mockAds } from "@/lib/mock-data";

export default function Home() {
  return (
    <main>
      <AdsToolbar />
      <CategorySlider />
      <FiltersAndSorting totalResults={10} />
      <AdListing ads={mockAds} hasMore={false} />
    </main>
  );
}

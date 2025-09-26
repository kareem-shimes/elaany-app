import AdListing from "@/features/home/components/AdListing";
import AdsToolbar from "@/features/home/components/AdsToolbar";
import CategorySlider from "@/features/home/components/CategorySlider";
import FiltersAndSorting from "@/features/home/components/FiltersAndSorting";
import { mockAds } from "@/lib/mock-data";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <AdsToolbar />
      <CategorySlider />
      <Suspense fallback={<div>Loading filters...</div>}>
        <FiltersAndSorting totalResults={10} />
      </Suspense>
      <AdListing ads={mockAds} hasMore={false} />
    </main>
  );
}

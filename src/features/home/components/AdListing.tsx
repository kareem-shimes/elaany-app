"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Ad } from "@/types";
import { MapPin, Clock } from "lucide-react";
import Image from "next/image";

interface AdCardProps {
  ad: Ad;
}

function AdCard({ ad }: AdCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            {ad.image ? (
              <Image
                src={ad.image}
                alt={ad.title}
                width={300}
                height={200}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <span className="text-gray-500">صورة الإعلان</span>
            )}
          </div>

          {/* overlays only (no badges or action buttons) */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Title and Description */}
          <div>
            <h3 className="text-lg font-semibold line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {ad.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {ad.description}
            </p>
          </div>

          {/* Location and Date */}
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{ad.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span>{ad.postedDate}</span>
            </div>
          </div>

          {/* Seller */}
          <div className="pt-2">
            <span className="text-sm text-muted-foreground">{ad.seller}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AdListingProps {
  ads: Ad[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function AdListing({ ads, loading, hasMore }: AdListingProps) {
  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-2">
            لم يتم العثور على إعلانات
          </p>
          <p className="text-sm text-muted-foreground">
            جرب تعديل كلمات البحث أو الفلاتر
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" disabled={loading}>
            {loading ? "جاري التحميل..." : "تحميل المزيد من الإعلانات"}
          </Button>
        </div>
      )}
    </div>
  );
}

export { AdCard };

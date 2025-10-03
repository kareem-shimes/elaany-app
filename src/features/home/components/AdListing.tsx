"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ad } from "@/types";
import { MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AdCardProps {
  ad: Ad;
}

function AdCard({ ad }: AdCardProps) {
  // helper to get seller initials when no image
  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sellerImage = ad.sellerImage;

  return (
    <Link href={`/ads/${ad.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group relative">
        <div className="flex items-start gap-4 p-4">
          {/* Image */}
          <div className="w-36 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-200">
            {ad.image ? (
              <Image
                src={ad.image}
                alt={ad.title}
                width={144}
                height={96}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                صورة الإعلان
              </div>
            )}
          </div>

          {/* Text / Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
              <h3 className="text-base md:text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {ad.title}
              </h3>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-primary">
                  {ad.price.toLocaleString("ar")}{" "}
                  {ad.currency === "USD"
                    ? "$"
                    : ad.currency === "SAR"
                    ? "ر.س"
                    : ad.currency}
                </p>
                {ad.isNegotiable && (
                  <p className="text-xs text-muted-foreground">قابل للتفاوض</p>
                )}
              </div>
            </div>
            <p className="hidden md:block text-sm text-muted-foreground line-clamp-2">
              {ad.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 md:gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate max-w-[10rem] sm:max-w-xs">
                  {ad.location}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>
                  {typeof ad.postedDate === "string"
                    ? ad.postedDate
                    : ad.postedDate.toLocaleDateString("ar")}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-medium text-muted-foreground">
                  {sellerImage ? (
                    <Image
                      src={sellerImage}
                      alt={ad.seller}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(ad.seller)}</span>
                  )}
                </div>

                <span className="text-sm text-muted-foreground truncate">
                  {ad.seller}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 pointer-events-none" />
      </Card>
    </Link>
  );
}

interface AdListingProps {
  ads: Ad[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function AdListing({
  ads,
  loading,
  hasMore,
  onLoadMore,
}: AdListingProps) {
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
      <div className="grid grid-cols-1 gap-6">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            disabled={loading}
            onClick={onLoadMore}
          >
            {loading ? "جاري التحميل..." : "تحميل المزيد من الإعلانات"}
          </Button>
        </div>
      )}
    </div>
  );
}

export { AdCard };

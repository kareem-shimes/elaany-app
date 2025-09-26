"use client";

import { Ad } from "@/types";
import { Heart, MapPin, Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface AdCardProps {
  ad: Ad;
  onFavorite?: (adId: string) => void;
  isFavorited?: boolean;
  showLocation?: boolean;
  showDate?: boolean;
  className?: string;
}

export function AdCard({
  ad,
  onFavorite,
  isFavorited = false,
  showLocation = true,
  showDate = true,
  className = "",
}: AdCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800";
      case "used":
        return "bg-blue-100 text-blue-800";
      case "refurbished":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/ads/${ad.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {ad.images && ad.images.length > 0 && !imageError ? (
            <Image
              src={ad.images[0]}
              alt={ad.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm">No image</p>
              </div>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavorite?.(ad.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isFavorited
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
          </button>

          {/* Condition Badge */}
          {ad.condition && (
            <div className="absolute top-3 left-3">
              <Badge className={`text-xs ${getConditionColor(ad.condition)}`}>
                {ad.condition.charAt(0).toUpperCase() + ad.condition.slice(1)}
              </Badge>
            </div>
          )}

          {/* Negotiable Badge */}
          {ad.negotiable && (
            <div className="absolute bottom-3 left-3">
              <Badge
                variant="secondary"
                className="text-xs bg-yellow-100 text-yellow-800"
              >
                Negotiable
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-green-600">
              {formatPrice(ad.price, ad.currency)}
            </h3>
            {ad.status === "sold" && (
              <Badge variant="destructive" className="text-xs">
                Sold
              </Badge>
            )}
          </div>

          {/* Title */}
          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {ad.title}
          </h4>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {ad.description}
          </p>

          {/* Features */}
          {ad.features && ad.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {ad.features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {ad.features.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{ad.features.length - 2} more
                </Badge>
              )}
            </div>
          )}

          {/* Footer Info */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              {showLocation && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{ad.location}</span>
                </div>
              )}
              {showDate && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(ad.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Quick Action Buttons (shown on hover) */}
      {isHovered && (
        <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm"
          >
            <Star className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

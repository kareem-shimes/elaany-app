import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface AdsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  location?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sortBy?: "newest" | "oldest" | "price-low" | "price-high";
}

// Helper function to format relative time in Arabic
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInHours < 1) {
    return "منذ أقل من ساعة";
  } else if (diffInHours < 24) {
    return `منذ ${diffInHours} ساعة`;
  } else if (diffInDays === 1) {
    return "منذ يوم واحد";
  } else if (diffInDays < 7) {
    return `منذ ${diffInDays} أيام`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `منذ ${weeks} ${weeks === 1 ? "أسبوع" : "أسابيع"}`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return `منذ ${months} ${months === 1 ? "شهر" : "أشهر"}`;
  }
}

export async function getAds(params: AdsQueryParams = {}) {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      subcategory,
      location,
      query,
      minPrice,
      maxPrice,
      condition,
      sortBy = "newest",
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.AdWhereInput = {
      status: "ACTIVE", // Only show active ads
    };

    if (category) {
      where.category = { slug: category };
    }

    if (subcategory) {
      where.subcategory = { slug: subcategory };
    }

    if (location) {
      // If location contains "|", it means we have multiple locations/countries
      if (location.includes("|")) {
        const locations = location.split("|");
        where.OR = [
          ...(where.OR || []),
          ...locations.map((loc) => ({
            location: {
              contains: loc,
              mode: "insensitive" as const,
            },
          })),
        ];
      } else {
        where.location = {
          contains: location,
          mode: "insensitive",
        };
      }
    }

    if (query) {
      where.OR = [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    if (condition && condition !== "all") {
      where.condition = condition.toUpperCase() as Prisma.EnumAdConditionFilter;
    }

    // Build orderBy clause
    let orderBy: Prisma.AdOrderByWithRelationInput = {};
    switch (sortBy) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Fetch ads with relations
    const [ads, total] = await Promise.all([
      prisma.ad.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          subcategory: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.ad.count({ where }),
    ]);

    // Transform data to match frontend expectations
    const transformedAds = ads.map((ad) => ({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      price: ad.price,
      currency: ad.currency,
      location: ad.location,
      categoryId: ad.categoryId,
      subcategoryId: ad.subcategoryId || undefined,
      category: ad.category.slug,
      subcategory: ad.subcategory?.slug,
      image: ad.image || undefined,
      images: ad.images,
      postedDate: formatRelativeTime(ad.postedDate),
      seller: ad.seller.name || "مستخدم مجهول",
      sellerImage: ad.seller.image || undefined,
      sellerId: ad.sellerId,
      featured: ad.featured,
      condition: ad.condition.toLowerCase(),
      views: ad.views,
      isNegotiable: ad.isNegotiable,
      phone: ad.phone || undefined,
    }));
    const hasNext = skip + limit < total;
    const hasPrevious = page > 1;

    return {
      data: transformedAds,
      total,
      page,
      limit,
      hasNext,
      hasPrevious,
    };
  } catch (error) {
    console.error("Error fetching ads:", error);
    throw new Error("Failed to fetch ads");
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          select: {
            id: true,
            name: true,
            slug: true,
            count: true,
          },
        },
        _count: {
          select: {
            ads: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      icon: category.icon,
      description: category.description,
      subcategories: category.subcategories,
      adsCount: category._count.ads,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

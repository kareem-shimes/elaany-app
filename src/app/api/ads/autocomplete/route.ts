import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "8");

    if (!query || query.length < 2) {
      return NextResponse.json({
        suggestions: [],
        ads: [],
      });
    }

    // Get suggestions from ad titles and categories
    const [adSuggestions, categorySuggestions] = await Promise.all([
      // Get unique ad titles that contain the query
      prisma.ad.findMany({
        where: {
          status: "ACTIVE",
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        select: {
          title: true,
        },
        distinct: ["title"],
        take: 5,
      }),
      // Get categories that match the query
      prisma.category.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              subcategories: {
                some: {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },
        select: {
          name: true,
          subcategories: {
            where: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            select: {
              name: true,
            },
          },
        },
        take: 3,
      }),
    ]);

    // Get recent ads that match the query for quick preview
    const recentAds = await prisma.ad.findMany({
      where: {
        status: "ACTIVE",
        OR: [
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
        ],
      },
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
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    // Prepare suggestions
    const suggestions: string[] = [];

    // Add ad title suggestions
    adSuggestions.forEach((ad) => {
      if (!suggestions.includes(ad.title)) {
        suggestions.push(ad.title);
      }
    });

    // Add category suggestions
    categorySuggestions.forEach((category) => {
      if (!suggestions.includes(category.name)) {
        suggestions.push(category.name);
      }
      // Add subcategory suggestions
      category.subcategories.forEach((sub) => {
        if (!suggestions.includes(sub.name)) {
          suggestions.push(sub.name);
        }
      });
    });

    // Transform ads data
    const transformedAds = recentAds.map((ad) => ({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      price: ad.price,
      currency: ad.currency,
      location: ad.location,
      categoryId: ad.categoryId,
      subcategoryId: ad.subcategoryId,
      category: ad.category.slug,
      subcategory: ad.subcategory?.slug,
      image: ad.image,
      images: ad.images,
      postedDate: ad.createdAt.toISOString(),
      seller: ad.seller.name || "مستخدم",
      sellerImage: ad.seller.image,
      sellerId: ad.sellerId,
      featured: ad.featured,
      condition: ad.condition,
      views: ad.views,
      isNegotiable: ad.isNegotiable,
      phone: ad.phone,
      status: ad.status,
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt,
    }));

    return NextResponse.json({
      suggestions: suggestions.slice(0, 5),
      ads: transformedAds,
    });
  } catch (error) {
    console.error("Autocomplete error:", error);
    return NextResponse.json(
      { error: "Failed to get suggestions" },
      { status: 500 }
    );
  }
}

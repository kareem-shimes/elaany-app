import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, AdCondition } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const condition = searchParams.get("condition");
    const sortBy = searchParams.get("sortBy") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Build where clause
    const where: Prisma.AdWhereInput = {
      status: "ACTIVE",
    };

    // Text search across title and description
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

    // Category filter
    if (category) {
      where.category = {
        slug: category,
      };
    }

    // Location filter
    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Condition filter
    if (condition) {
      where.condition = condition.toUpperCase() as AdCondition;
    }

    // Build orderBy clause
    let orderBy: Prisma.AdOrderByWithRelationInput = { createdAt: "desc" }; // default to newest
    switch (sortBy) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Get total count for pagination
    const total = await prisma.ad.count({ where });

    // Get ads with relationships
    const ads = await prisma.ad.findMany({
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
      orderBy,
      skip: offset,
      take: limit,
    });

    // Transform data to match frontend types
    const transformedAds = ads.map((ad) => ({
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

    const hasNext = offset + limit < total;
    const hasPrevious = page > 1;

    return NextResponse.json({
      data: transformedAds,
      total,
      page,
      limit,
      hasNext,
      hasPrevious,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search ads" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AdCondition, AdStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists in database, create if not
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      // Create user in database if doesn't exist
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.name,
          image: user.image,
        },
      });
    }

    const body = await request.json();

    const {
      title,
      description,
      price,
      currency = "USD",
      location,
      categoryId,
      subcategoryId,
      condition = "USED",
      isNegotiable = false,
      phone,
      images = [],
    } = body;

    // Validate required fields
    if (!title || !description || !price || !categoryId || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Validate subcategory if provided
    if (subcategoryId) {
      const subcategory = await prisma.subCategory.findUnique({
        where: { id: subcategoryId },
      });

      if (!subcategory || subcategory.categoryId !== categoryId) {
        return NextResponse.json(
          { error: "Invalid subcategory" },
          { status: 400 }
        );
      }
    }

    // Create the ad
    const ad = await prisma.ad.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        currency,
        location,
        categoryId,
        subcategoryId: subcategoryId || undefined,
        condition: condition.toUpperCase() as AdCondition,
        isNegotiable,
        phone: phone || undefined,
        images,
        sellerId: dbUser.id,
        status: AdStatus.ACTIVE,
      },
      include: {
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
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const query = searchParams.get("query");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const condition = searchParams.get("condition");

    // Handle multiple locations and countries
    const locations = searchParams.getAll("location");
    const countries = searchParams.getAll("country");

    // Map sort values from FiltersAndSorting to expected values
    const mapSortValue = (
      sortBy?: string | null
    ): "newest" | "oldest" | "price-low" | "price-high" => {
      switch (sortBy) {
        case "auto":
          return "newest";
        case "price-low":
          return "price-low";
        case "price-high":
          return "price-high";
        case "popular":
          return "newest"; // For now, map popular to newest
        default:
          return "newest";
      }
    };

    const sortBy = mapSortValue(searchParams.get("sortBy"));

    // Build location filter - combine countries and specific cities
    let locationFilter: string | undefined;
    if (countries.includes("كل المناطق")) {
      // If "كل المناطق" is selected, don't filter by location
      locationFilter = undefined;
    } else if (locations.includes("الكل")) {
      // If "الكل" cities is selected, filter by selected countries only
      if (countries.length > 0) {
        // Create a regex pattern that matches any of the selected countries
        locationFilter = countries.join("|");
      }
    } else if (locations.length > 0) {
      // Filter by specific cities
      locationFilter = locations.join("|");
    } else if (countries.length > 0) {
      // Filter by countries if no specific cities are selected
      locationFilter = countries.join("|");
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {
      status: AdStatus.ACTIVE,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (subcategory) {
      where.subcategory = { slug: subcategory };
    }

    if (locationFilter) {
      // If locationFilter contains "|", it means we have multiple locations/countries
      if (locationFilter.includes("|")) {
        const locations = locationFilter.split("|");
        where.OR = [
          ...((where.OR as Array<Record<string, unknown>>) || []),
          ...locations.map((loc) => ({
            location: {
              contains: loc,
              mode: "insensitive",
            },
          })),
        ];
      } else {
        where.location = {
          contains: locationFilter,
          mode: "insensitive",
        };
      }
    }

    if (query) {
      const searchConditions = [
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

      if (where.OR) {
        // Combine with existing OR conditions using AND
        where.AND = [{ OR: where.OR }, { OR: searchConditions }];
        delete where.OR;
      } else {
        where.OR = searchConditions;
      }
    }

    if (minPrice || maxPrice) {
      where.price = {} as Record<string, number>;
      if (minPrice)
        (where.price as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice)
        (where.price as Record<string, number>).lte = parseFloat(maxPrice);
    }

    if (condition && condition !== "all") {
      where.condition = condition.toUpperCase();
    }

    // Build orderBy clause
    let orderBy: Record<string, string> = { createdAt: "desc" };
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
    }

    // Fetch ads
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

    // Transform data to match frontend expectations
    const transformedAds = ads.map(
      (ad: {
        id: number;
        title: string;
        description: string;
        price: number;
        currency: string;
        location: string;
        categoryId: string;
        subcategoryId?: string | null;
        category: { slug: string };
        subcategory?: { slug: string } | null;
        image?: string | null;
        images: string[];
        postedDate: Date;
        seller: { name?: string | null; image?: string | null };
        sellerId: string;
        featured: boolean;
        condition: string;
        views: number;
        isNegotiable: boolean;
        phone?: string | null;
      }) => ({
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
      })
    );

    const hasNext = skip + limit < total;
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
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

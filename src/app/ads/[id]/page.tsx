import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Eye } from "lucide-react";
import Image from "next/image";

interface AdPageProps {
  params: {
    id: string;
  };
}

async function getAd(id: string) {
  try {
    const ad = await prisma.ad.findUnique({
      where: {
        id: parseInt(id),
        status: "ACTIVE",
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
    });

    if (!ad) {
      return null;
    }

    // Increment view count
    await prisma.ad.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } },
    });

    return ad;
  } catch (error) {
    console.error("Error fetching ad:", error);
    return null;
  }
}

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

export default async function AdPage({ params }: AdPageProps) {
  const ad = await getAd(params.id);

  if (!ad) {
    notFound();
  }

  const currencySymbol = ad.currency === "USD" ? "$" : "ر.س";
  const conditionText =
    ad.condition === "NEW"
      ? "جديد"
      : ad.condition === "USED"
      ? "مستعمل"
      : "مجدد";

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                  {ad.image ? (
                    <Image
                      src={ad.image}
                      alt={ad.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span>لا توجد صورة</span>
                    </div>
                  )}
                </div>
                {ad.images && ad.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {ad.images.slice(1, 6).map((image: string, index) => (
                      <div
                        key={index}
                        className="aspect-square relative bg-gray-100 rounded overflow-hidden"
                      >
                        <Image
                          src={image}
                          alt={`${ad.title} - صورة ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{ad.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatRelativeTime(ad.postedDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {ad.views} مشاهدة
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {ad.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-blue-600">
                      {ad.price.toLocaleString()} {currencySymbol}
                    </div>
                    {ad.isNegotiable && (
                      <Badge variant="outline" className="mt-1">
                        قابل للتفاوض
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{ad.category.name}</Badge>
                    {ad.subcategory && (
                      <Badge variant="outline">{ad.subcategory.name}</Badge>
                    )}
                    <Badge variant="outline">{conditionText}</Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">الوصف</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {ad.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">معلومات البائع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    {ad.seller.image ? (
                      <Image
                        src={ad.seller.image}
                        alt={ad.seller.name || "البائع"}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-gray-600">
                        {(ad.seller.name || "مستخدم").charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {ad.seller.name || "مستخدم مجهول"}
                    </div>
                    <div className="text-sm text-gray-500">عضو</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {ad.phone && (
                    <Button className="w-full" size="lg">
                      <Phone className="h-4 w-4 mr-2" />
                      {ad.phone}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ad Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">تفاصيل الإعلان</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">رقم الإعلان:</span>
                    <span className="font-semibold">#{ad.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">الفئة:</span>
                    <span>{ad.category.name}</span>
                  </div>
                  {ad.subcategory && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">الفئة الفرعية:</span>
                      <span>{ad.subcategory.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">الحالة:</span>
                    <span>{conditionText}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">الموقع:</span>
                    <span>{ad.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">تاريخ النشر:</span>
                    <span>{formatRelativeTime(ad.postedDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

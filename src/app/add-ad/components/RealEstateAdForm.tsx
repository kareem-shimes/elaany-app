"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  ChevronDown,
  MapPin,
  Phone,
  DollarSign,
  Home,
  Bed,
  Bath,
  Square,
  Calendar,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

interface RealEstateAdFormProps {
  category: Category;
  onBack: () => void;
  isRental: boolean;
}

interface RealEstateFormData {
  title: string;
  description: string;
  price: string;
  currency: string;
  location: string;
  phone: string;
  isNegotiable: boolean;

  // Real Estate-specific fields
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  floor: string;
  buildingAge: string;
  furnished: string;
  parking: string;
  elevator: string;
  balcony: string;
  garden: string;
  images: string[];
}

const propertyTypes = [
  "شقة",
  "فيلا",
  "دور",
  "شاليه",
  "مكتب",
  "محل تجاري",
  "مستودع",
  "أرض سكنية",
  "أرض تجارية",
  "مزرعة",
];

const furnishedOptions = ["مفروش", "غير مفروش", "نصف مفروش"];
const buildingAges = [
  "جديد",
  "أقل من 5 سنوات",
  "5-10 سنوات",
  "10-20 سنة",
  "أكثر من 20 سنة",
];
const yesNoOptions = ["نعم", "لا"];

export default function RealEstateAdForm({
  category,
  onBack,
  isRental,
}: RealEstateAdFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<RealEstateFormData>({
    title: "",
    description: "",
    price: "",
    currency: "SAR",
    location: "",
    phone: "",
    isNegotiable: false,
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    floor: "",
    buildingAge: "",
    furnished: "",
    parking: "",
    elevator: "",
    balcony: "",
    garden: "",
    images: [],
  });

  const updateField = (
    field: keyof RealEstateFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: `${formData.description}

تفاصيل العقار:
• نوع العقار: ${formData.propertyType}
• المساحة: ${formData.area} متر مربع
${formData.bedrooms ? `• عدد الغرف: ${formData.bedrooms}` : ""}
${formData.bathrooms ? `• عدد الحمامات: ${formData.bathrooms}` : ""}
${formData.floor ? `• الطابق: ${formData.floor}` : ""}
${formData.buildingAge ? `• عمر المبنى: ${formData.buildingAge}` : ""}
${formData.furnished ? `• الأثاث: ${formData.furnished}` : ""}
${formData.parking ? `• موقف سيارة: ${formData.parking}` : ""}
${formData.elevator ? `• مصعد: ${formData.elevator}` : ""}
${formData.balcony ? `• بلكونة: ${formData.balcony}` : ""}
${formData.garden ? `• حديقة: ${formData.garden}` : ""}`,
          price: parseFloat(formData.price),
          currency: formData.currency,
          location: formData.location,
          categoryId: category.id,
          subcategoryId: isRental
            ? category.subcategories.find((sub) => sub.slug.includes("rent"))
                ?.id || ""
            : category.subcategories.find((sub) => sub.slug.includes("sale"))
                ?.id || "",
          condition: "NEW",
          isNegotiable: formData.isNegotiable,
          phone: formData.phone,
          images: formData.images,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create ad");
      }

      const result = await response.json();
      setSuccess(true);

      setTimeout(() => {
        router.push(`/ads/${result.id}`);
      }, 1500);
    } catch (error) {
      console.error("Error creating real estate ad:", error);
      setError(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء إنشاء الإعلان. حاول مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowRight className="h-4 w-4" />
          رجوع
        </Button>
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">
            {isRental ? "عرض عقار للإيجار" : "عرض عقار للبيع"}
          </h2>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-semibold">تم إنشاء الإعلان بنجاح!</span>
          </div>
          <p className="text-green-700 mt-1">
            سيتم توجيهك إلى صفحة الإعلان خلال ثوانٍ...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="font-semibold">خطأ</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        style={{ opacity: success ? 0.6 : 1 }}
      >
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg mb-4">المعلومات الأساسية</h3>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الإعلان *</Label>
              <Input
                id="title"
                placeholder={
                  isRental
                    ? "مثال: شقة للإيجار في حي الملز 3 غرف"
                    : "مثال: فيلا للبيع في حي النرجس 4 غرف مع حديقة"
                }
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
                maxLength={100}
              />
            </div>

            {/* Location and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  المدينة والحي *
                </Label>
                <Input
                  id="location"
                  placeholder="الرياض - حي الملز"
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+966 50 123 4567"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg mb-4">تفاصيل العقار</h3>

            {/* Property Type and Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نوع العقار *</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.propertyType || "اختر نوع العقار"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                    {propertyTypes.map((type) => (
                      <DropdownMenuItem
                        key={type}
                        onClick={() => updateField("propertyType", type)}
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area" className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  المساحة (متر مربع) *
                </Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="120"
                  value={formData.area}
                  onChange={(e) => updateField("area", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Bedrooms and Bathrooms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms" className="flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  عدد الغرف
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  placeholder="3"
                  value={formData.bedrooms}
                  onChange={(e) => updateField("bedrooms", e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms" className="flex items-center gap-2">
                  <Bath className="h-4 w-4" />
                  عدد الحمامات
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  placeholder="2"
                  value={formData.bathrooms}
                  onChange={(e) => updateField("bathrooms", e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Floor and Building Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor">الطابق</Label>
                <Input
                  id="floor"
                  placeholder="الأرضي، الأول، الثاني..."
                  value={formData.floor}
                  onChange={(e) => updateField("floor", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  عمر المبنى
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.buildingAge || "اختر عمر المبنى"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {buildingAges.map((age) => (
                      <DropdownMenuItem
                        key={age}
                        onClick={() => updateField("buildingAge", age)}
                      >
                        {age}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Furnished (for rentals) */}
            {isRental && (
              <div className="space-y-2">
                <Label>الأثاث</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.furnished || "اختر حالة الأثاث"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {furnishedOptions.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => updateField("furnished", option)}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Additional Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>موقف سيارة</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.parking || "اختر"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {yesNoOptions.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => updateField("parking", option)}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label>مصعد</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.elevator || "اختر"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {yesNoOptions.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => updateField("elevator", option)}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label>بلكونة</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.balcony || "اختر"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {yesNoOptions.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => updateField("balcony", option)}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label>حديقة</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.garden || "اختر"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {yesNoOptions.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => updateField("garden", option)}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg mb-4">
              {isRental ? "الإيجار" : "السعر"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {isRental ? "الإيجار الشهري *" : "السعر *"}
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder={isRental ? "3000" : "500000"}
                  value={formData.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  required
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>العملة</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.currency === "SAR"
                        ? "ريال سعودي"
                        : "دولار أمريكي"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem
                      onClick={() => updateField("currency", "SAR")}
                    >
                      ريال سعودي (SAR)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateField("currency", "USD")}
                    >
                      دولار أمريكي (USD)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="negotiable"
                checked={formData.isNegotiable}
                onChange={(e) => updateField("isNegotiable", e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="negotiable" className="text-sm">
                {isRental ? "الإيجار قابل للتفاوض" : "السعر قابل للتفاوض"}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg mb-4">الوصف</h3>

            <div className="space-y-2">
              <Label htmlFor="description">وصف إضافي للعقار *</Label>
              <textarea
                id="description"
                placeholder="اكتب تفاصيل إضافية عن العقار، المرافق القريبة، شروط الإيجار (إن وجدت)، إلخ..."
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                required
                rows={5}
                maxLength={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500">
                {formData.description.length}/1000 حرف
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg mb-4">الصور</h3>

            <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  اضغط لرفع صور العقار أو اسحبها هنا
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, WEBP حتى 5MB لكل صورة (ينصح برفع صور للواجهة، الغرف،
                  المطبخ، الحمامات)
                </p>
                <Button type="button" variant="outline" className="mt-4">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  اختر الصور
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={
              loading ||
              !formData.title ||
              !formData.propertyType ||
              !formData.area ||
              !formData.price ||
              !formData.location
            }
            className="px-8"
          >
            {loading ? "جارٍ النشر..." : "نشر الإعلان"}
          </Button>
        </div>
      </form>
    </div>
  );
}

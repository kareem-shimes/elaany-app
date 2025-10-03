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
  Package,
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

interface GeneralAdFormProps {
  category: Category;
  onBack: () => void;
}

interface GeneralFormData {
  title: string;
  description: string;
  price: string;
  currency: string;
  location: string;
  subcategoryId: string;
  condition: string;
  isNegotiable: boolean;
  phone: string;
  images: string[];
}

export default function GeneralAdForm({
  category,
  onBack,
}: GeneralAdFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<GeneralFormData>({
    title: "",
    description: "",
    price: "",
    currency: "SAR",
    location: "",
    subcategoryId: "",
    condition: "USED",
    isNegotiable: false,
    phone: "",
    images: [],
  });

  const updateField = (
    field: keyof GeneralFormData,
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
          description: formData.description,
          price: parseFloat(formData.price),
          currency: formData.currency,
          location: formData.location,
          categoryId: category.id,
          subcategoryId: formData.subcategoryId || undefined,
          condition: formData.condition,
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
      console.error("Error creating ad:", error);
      setError(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء إنشاء الإعلان. حاول مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedSubcategory = category.subcategories.find(
    (sub) => sub.id === formData.subcategoryId
  );

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
          <Package className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">عرض {category.name} للبيع</h2>
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
                placeholder="اكتب عنوان واضح وجذاب"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
                maxLength={100}
              />
              <p className="text-sm text-gray-500">
                {formData.title.length}/100 حرف
              </p>
            </div>

            {/* Subcategory */}
            <div className="space-y-2">
              <Label>الفئة الفرعية</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    type="button"
                  >
                    {selectedSubcategory
                      ? selectedSubcategory.name
                      : "اختر الفئة الفرعية"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {category.subcategories.map((subcategory) => (
                    <DropdownMenuItem
                      key={subcategory.id}
                      onClick={() =>
                        updateField("subcategoryId", subcategory.id)
                      }
                    >
                      {subcategory.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Location and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  الموقع *
                </Label>
                <Input
                  id="location"
                  placeholder="المدينة، المنطقة"
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

        {/* Price and Condition */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg mb-4">السعر والحالة</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  السعر *
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label>العملة</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      type="button"
                    >
                      {formData.currency === "USD"
                        ? "دولار أمريكي"
                        : "ريال سعودي"}
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

            <div className="space-y-2">
              <Label>حالة السلعة</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    type="button"
                  >
                    {formData.condition === "NEW"
                      ? "جديد"
                      : formData.condition === "USED"
                      ? "مستعمل"
                      : "مجدد"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem
                    onClick={() => updateField("condition", "NEW")}
                  >
                    جديد
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateField("condition", "USED")}
                  >
                    مستعمل
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateField("condition", "REFURBISHED")}
                  >
                    مجدد
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                السعر قابل للتفاوض
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg mb-4">الوصف</h3>

            <div className="space-y-2">
              <Label htmlFor="description">وصف مفصل *</Label>
              <textarea
                id="description"
                placeholder="اكتب وصف شامل ومفصل للسلعة أو الخدمة..."
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                required
                rows={5}
                maxLength={2000}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500">
                {formData.description.length}/2000 حرف
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
                  اضغط لرفع الصور أو اسحبها هنا
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, WEBP حتى 5MB لكل صورة
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
              !formData.description ||
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

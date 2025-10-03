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
  Upload,
  ChevronDown,
  MapPin,
  Phone,
  DollarSign,
  Package,
  FileText,
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

interface AddAdFormProps {
  categories: Category[];
  userId: string;
}

interface FormData {
  title: string;
  description: string;
  price: string;
  currency: string;
  location: string;
  categoryId: string;
  subcategoryId: string;
  condition: string;
  isNegotiable: boolean;
  phone: string;
  images: string[];
}

export default function AddAdForm({ categories, userId }: AddAdFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    currency: "USD",
    location: "",
    categoryId: "",
    subcategoryId: "",
    condition: "USED",
    isNegotiable: false,
    phone: "",
    images: [],
  });

  // Get selected category and subcategory objects
  const selectedCategory = categories.find(
    (cat) => cat.id === formData.categoryId
  );
  const selectedSubcategory = selectedCategory?.subcategories.find(
    (sub) => sub.id === formData.subcategoryId
  );

  // Handle form field updates
  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset subcategory when category changes
      ...(field === "categoryId" && { subcategoryId: "" }),
    }));
  };

  // Handle form submission
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
          ...formData,
          price: parseFloat(formData.price),
          sellerId: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create ad");
      }

      const result = await response.json();
      setSuccess(true);

      // Redirect to the new ad page after a short delay
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

  return (
    <div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              عنوان الإعلان *
            </Label>
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

          {/* Category */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              الفئة *
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  type="button"
                >
                  {selectedCategory ? selectedCategory.name : "اختر الفئة"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => updateField("categoryId", category.id)}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Subcategory */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              الفئة الفرعية
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  type="button"
                  disabled={!selectedCategory}
                >
                  {selectedSubcategory
                    ? selectedSubcategory.name
                    : "اختر الفئة الفرعية"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {selectedCategory?.subcategories.map((subcategory) => (
                  <DropdownMenuItem
                    key={subcategory.id}
                    onClick={() => updateField("subcategoryId", subcategory.id)}
                  >
                    {subcategory.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              السعر *
            </Label>
            <div className="relative">
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
                required
                min="0"
                step="0.01"
                className="pr-16"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {formData.currency === "USD" ? "$" : "ر.س"}
              </div>
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              العملة
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  type="button"
                >
                  {formData.currency === "USD" ? "دولار أمريكي" : "ريال سعودي"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem
                  onClick={() => updateField("currency", "USD")}
                >
                  دولار أمريكي (USD)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateField("currency", "SAR")}
                >
                  ريال سعودي (SAR)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Location */}
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

          {/* Phone */}
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

          {/* Condition */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              حالة السلعة
            </Label>
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

          {/* Negotiable */}
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
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            وصف مفصل *
          </Label>
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

        {/* Images Upload */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            الصور (اختياري)
          </Label>
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
                اختر الصور
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={
              loading ||
              success ||
              !formData.title ||
              !formData.description ||
              !formData.price ||
              !formData.categoryId ||
              !formData.location
            }
            className="px-8"
          >
            {loading ? "جارٍ النشر..." : success ? "تم النشر!" : "نشر الإعلان"}
          </Button>
        </div>
      </form>
    </div>
  );
}

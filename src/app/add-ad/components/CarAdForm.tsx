"use client";

import { useState, useRef } from "react";
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
  ChevronDown,
  MapPin,
  Phone,
  DollarSign,
  Car,
  Calendar,
  Gauge,
  Fuel,
  Upload,
  Image as ImageIcon,
  X,
  ArrowRight,
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

interface CarAdFormProps {
  category: Category;
  onBack: () => void;
  isRental?: boolean;
}

interface CarFormData {
  title: string;
  description: string;
  price: string;
  currency: string;
  location: string;
  phone: string;
  isNegotiable: boolean;

  // Car-specific fields
  brand: string;
  model: string;
  year: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  condition: string;
  bodyType: string;
  engineSize: string;
  images: File[];
}

const carBrands = [
  "تويوتا",
  "هوندا",
  "نيسان",
  "هيونداي",
  "كيا",
  "مازدا",
  "ميتسوبيشي",
  "شيفروليه",
  "فورد",
  "جي إم سي",
  "بي إم دبليو",
  "مرسيدس بنز",
  "أودي",
  "لكزس",
  "إنفينيتي",
  "جاكوار",
  "لاند روفر",
  "أخرى",
];

const fuelTypes = ["بنزين", "ديزل", "هايبرد", "كهربائي"];
const transmissions = ["عادي", "أوتوماتيك", "CVT"];
const conditions = ["ممتاز", "جيد جداً", "جيد", "يحتاج صيانة"];
const bodyTypes = [
  "سيدان",
  "هاتشباك",
  "SUV",
  "كروس أوفر",
  "بيك أب",
  "كوبيه",
  "كونفرتيبل",
];

export default function CarAdForm({
  category,
  onBack,
  isRental = false,
}: CarAdFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const [formData, setFormData] = useState<CarFormData>({
    title: "",
    description: "",
    price: "",
    currency: "SAR",
    location: "",
    phone: "",
    isNegotiable: false,
    brand: "",
    model: "",
    year: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    condition: "",
    bodyType: "",
    engineSize: "",
    images: [],
  });

  const updateField = (
    field: keyof CarFormData,
    value: string | boolean | File[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        setError(
          `نوع الملف غير مدعوم: ${file.name}. يرجى استخدام PNG, JPG, أو WEBP`
        );
        return;
      }

      if (file.size > maxSize) {
        setError(`حجم الملف كبير جداً: ${file.name}. الحد الأقصى 5MB`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const currentImages = formData.images || [];
      const totalImages = currentImages.length + validFiles.length;

      if (totalImages > 10) {
        setError("يمكن رفع 10 صور كحد أقصى");
        return;
      }

      updateField("images", [...currentImages, ...validFiles]);
      setError(null);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    updateField("images", newImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate category data
    if (!category?.id) {
      setError("بيانات الفئة غير متوفرة. يرجى المحاولة مرة أخرى.");
      setLoading(false);
      return;
    }

    // Validate required fields
    const requiredFields = {
      title: formData.title,
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      price: formData.price,
      location: formData.location,
      description: formData.description,
      mileage: formData.mileage,
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      condition: formData.condition,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setError(`يرجى ملء جميع الحقول المطلوبة: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      // Upload images first
      const imageUrls: string[] = [];
      if (formData.images.length > 0) {
        setImageUploadLoading(true);

        for (const image of formData.images) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", image);

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (uploadResponse.ok) {
            const { url } = await uploadResponse.json();
            imageUrls.push(url);
          }
        }

        setImageUploadLoading(false);
      }
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: `${formData.description}

تفاصيل السيارة:
• الماركة: ${formData.brand}
• الموديل: ${formData.model}
• سنة الصنع: ${formData.year}
• المسافة المقطوعة: ${formData.mileage} كم
• نوع الوقود: ${formData.fuelType}
• ناقل الحركة: ${formData.transmission}
• الحالة: ${formData.condition}
• نوع الهيكل: ${formData.bodyType}
${formData.engineSize ? `• حجم المحرك: ${formData.engineSize}` : ""}`,
          price: parseFloat(formData.price),
          currency: formData.currency,
          location: formData.location,
          categoryId: category?.id || "",
          subcategoryId:
            category?.subcategories?.find((sub) => sub.slug === "sedan")?.id ||
            "",
          condition: "USED",
          isNegotiable: formData.isNegotiable,
          phone: formData.phone,
          images: imageUrls,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: Failed to create ad`
        );
      }

      const result = await response.json();
      setSuccess(true);

      setTimeout(() => {
        if (result?.id) {
          router.push(`/ads/${result.id}`);
        } else {
          router.push("/");
        }
      }, 1500);
    } catch (error) {
      console.error("Error creating car ad:", error);
      setError(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء إنشاء الإعلان. حاول مرة أخرى."
      );
    } finally {
      setLoading(false);
      setImageUploadLoading(false);
    }
  };

  // Generate years from current year back to 1990
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1989 },
    (_, i) => currentYear - i
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
          <Car className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">
            {isRental ? "عرض سيارة للإيجار" : "عرض سيارة للبيع"}
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
                placeholder="مثال: تويوتا كامري 2020 فل كامل"
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
                  المدينة *
                </Label>
                <Input
                  id="location"
                  placeholder="الرياض، جدة، الدمام..."
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

        {/* Car Details */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg mb-4">تفاصيل السيارة</h3>

            {/* Brand and Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الماركة *</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.brand || "اختر الماركة"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                    {carBrands.map((brand) => (
                      <DropdownMenuItem
                        key={brand}
                        onClick={() => updateField("brand", brand)}
                      >
                        {brand}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">الموديل *</Label>
                <Input
                  id="model"
                  placeholder="كامري، أكورد، التيما..."
                  value={formData.model}
                  onChange={(e) => updateField("model", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Year and Mileage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  سنة الصنع *
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.year || "اختر السنة"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                    {years.map((year) => (
                      <DropdownMenuItem
                        key={year}
                        onClick={() => updateField("year", year.toString())}
                      >
                        {year}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage" className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  المسافة المقطوعة (كم) *
                </Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="150000"
                  value={formData.mileage}
                  onChange={(e) => updateField("mileage", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Fuel Type and Transmission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Fuel className="h-4 w-4" />
                  نوع الوقود *
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.fuelType || "اختر نوع الوقود"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {fuelTypes.map((fuel) => (
                      <DropdownMenuItem
                        key={fuel}
                        onClick={() => updateField("fuelType", fuel)}
                      >
                        {fuel}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label>ناقل الحركة *</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.transmission || "اختر ناقل الحركة"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {transmissions.map((trans) => (
                      <DropdownMenuItem
                        key={trans}
                        onClick={() => updateField("transmission", trans)}
                      >
                        {trans}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Condition and Body Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>حالة السيارة *</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.condition || "اختر الحالة"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {conditions.map((condition) => (
                      <DropdownMenuItem
                        key={condition}
                        onClick={() => updateField("condition", condition)}
                      >
                        {condition}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label>نوع الهيكل</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {formData.bodyType || "اختر نوع الهيكل"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {bodyTypes.map((bodyType) => (
                      <DropdownMenuItem
                        key={bodyType}
                        onClick={() => updateField("bodyType", bodyType)}
                      >
                        {bodyType}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Engine Size */}
            <div className="space-y-2">
              <Label htmlFor="engineSize">حجم المحرك (اختياري)</Label>
              <Input
                id="engineSize"
                placeholder="2.4L، 3.5L، V6..."
                value={formData.engineSize}
                onChange={(e) => updateField("engineSize", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Price */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg mb-4">
              {isRental ? "سعر الإيجار" : "السعر"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {isRental ? "سعر الإيجار اليومي *" : "السعر *"}
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder={isRental ? "200" : "50000"}
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
              <Label htmlFor="description">وصف إضافي للسيارة *</Label>
              <textarea
                id="description"
                placeholder="اكتب تفاصيل إضافية عن السيارة، الصيانة، الحوادث، الإضافات، إلخ..."
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

            {/* Upload Area */}
            <div
              className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors rounded-lg p-6 text-center cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                اضغط لرفع صور السيارة أو اسحبها هنا
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, WEBP حتى 5MB لكل صورة (ينصح برفع 5-10 صور)
              </p>
              <Button type="button" variant="outline" className="mt-4">
                <ImageIcon className="h-4 w-4 mr-2" />
                اختر الصور
              </Button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  الصور المرفوعة ({formData.images.length}/10)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`صورة ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {imageUploadLoading && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">جارٍ رفع الصور...</p>
              </div>
            )}
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
              !formData.brand ||
              !formData.model ||
              !formData.year ||
              !formData.price ||
              !formData.location
            }
            className="px-8"
          >
            {loading
              ? "جارٍ النشر..."
              : isRental
              ? "نشر إعلان الإيجار"
              : "نشر الإعلان"}
          </Button>
        </div>
      </form>
    </div>
  );
}

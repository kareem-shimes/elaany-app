import Link from "@/components/ui/link";
import {
  FileText,
  Award,
  Package,
  Mail,
  Shield,
  Phone,
  Calendar,
  Truck,
  RotateCcw,
  Settings,
  Heart,
  ShoppingCart,
  Search,
  Home,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-6 border-t border-gray-200 mt-auto">
      <div className="container">
        <ul className="flex items-center gap-0.5 justify-center mb-6">
          <li>
            <Link href="/">
              <Image
                src="/assets/images/google-play.webp"
                alt="Google Play"
                width={200}
                height={100}
              />
            </Link>
          </li>
          <li>
            <Link href="/">
              <Image
                src="/assets/images/app-store.webp"
                alt="Google Play"
                width={150}
                height={100}
              />
            </Link>
          </li>
        </ul>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* العروض المميزة - Featured Offers */}
          <div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products/featured"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <Award className="w-4 h-4" />
                  العروض الخاصة
                </Link>
              </li>
              <li>
                <Link
                  href="/products/deals"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  صفقات اليوم
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  تصفح الفئات
                </Link>
              </li>
            </ul>
          </div>

          {/* خدمة العملاء - Customer Service */}
          <div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  الدعم الفني
                </Link>
              </li>
              <li>
                <Link
                  href="/orders/track"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  تتبع الطلب
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  الإرجاع والاستبدال
                </Link>
              </li>
            </ul>
          </div>

          {/* حسابي - My Account */}
          <div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/account/profile"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  إعدادات الحساب
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  طلباتي
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  قائمة الأمنيات
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  سلة التسوق
                </Link>
              </li>
            </ul>
          </div>

          {/* معلومات الشركة - Company Info */}
          <div>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors"
                >
                  <Truck className="w-4 h-4" />
                  سياسة الشحن
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <span className="text-muted-foreground text-center block mt-20 border-t border-border pt-6">
          اعلاني © 2025 جميع الحقوق محفوظة
        </span>
      </div>
    </footer>
  );
}

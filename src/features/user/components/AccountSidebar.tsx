"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { User, ShoppingBag, MapPin, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const accountMenuItems = [
  {
    href: "/account/profile",
    label: "الملف الشخصي",
    icon: User,
  },
  {
    href: "/account/orders",
    label: "طلباتي",
    icon: ShoppingBag,
  },
  {
    href: "/account/addresses",
    label: "العناوين",
    icon: MapPin,
  },
  {
    href: "/account/settings",
    label: "الإعدادات",
    icon: Settings,
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-right">حسابي</h2>
      <nav className="space-y-2">
        {accountMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-end gap-3 px-4 py-3 rounded-lg transition-colors text-right",
                isActive
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "hover:bg-gray-50 text-gray-700"
              )}
            >
              <span className="font-medium">{item.label}</span>
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-end gap-3 px-4 py-3 rounded-lg transition-colors text-right hover:bg-red-50 text-red-600"
        >
          <span className="font-medium">تسجيل الخروج</span>
          <LogOut className="h-5 w-5" />
        </button>
      </nav>
    </Card>
  );
}

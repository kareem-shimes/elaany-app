"use client";

import {
  User,
  LogOut,
  Settings,
  Heart,
  Package,
  CreditCard,
} from "lucide-react";
import HoverDropdown, {
  HoverDropdownItem,
  HoverDropdownLabel,
  HoverDropdownSeparator,
} from "@/components/ui/hover-dropdown-menu";
import { useAuth, AuthUtils, UserAvatar } from "@/features/auth";
import { Routes } from "@/constants/enums";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();

  // Don't render if user is not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  const displayName = AuthUtils.getDisplayName(user);

  const handleSignOut = async () => {
    await signOut();
    router.push(Routes.ROOT);
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <HoverDropdown
      trigger={
        <button
          type="button"
          className="flex items-center gap-2 text-primary-foreground transition-colors hover:opacity-80"
        >
          <UserAvatar user={user} size={45} showBorder={true} />
        </button>
      }
      width="w-64"
    >
      <div className="p-1">
        {/* User Profile Header */}
        <div className="px-3 py-2 border-b border-border">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <HoverDropdownLabel className="mt-2">حسابي</HoverDropdownLabel>
        <HoverDropdownSeparator />

        <HoverDropdownItem onClick={() => navigateTo("/account/profile")}>
          <User className="ml-2 h-4 w-4" />
          <span>الملف الشخصي</span>
        </HoverDropdownItem>

        <HoverDropdownItem onClick={() => navigateTo("/account/orders")}>
          <Package className="ml-2 h-4 w-4" />
          <span>طلباتي</span>
        </HoverDropdownItem>

        <HoverDropdownItem onClick={() => navigateTo("/wishlist")}>
          <Heart className="ml-2 h-4 w-4" />
          <span>المفضلة</span>
        </HoverDropdownItem>

        <HoverDropdownItem onClick={() => navigateTo("/account/addresses")}>
          <CreditCard className="ml-2 h-4 w-4" />
          <span>العناوين</span>
        </HoverDropdownItem>

        <HoverDropdownItem onClick={() => navigateTo("/account/settings")}>
          <Settings className="ml-2 h-4 w-4" />
          <span>الإعدادات</span>
        </HoverDropdownItem>

        <HoverDropdownSeparator />

        <HoverDropdownItem
          onClick={handleSignOut}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="ml-2 h-4 w-4" />
          <span>تسجيل الخروج</span>
        </HoverDropdownItem>
      </div>
    </HoverDropdown>
  );
}

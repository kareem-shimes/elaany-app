"use client";

import {
  User,
  LogOut,
  Settings,
  Heart,
  Package,
  CreditCard,
  UserCircle2,
} from "lucide-react";
import HoverDropdown, {
  HoverDropdownItem,
  HoverDropdownLabel,
  HoverDropdownSeparator,
} from "@/components/ui/hover-dropdown-menu";

export default function UserMenu() {
  return (
    <HoverDropdown
      trigger={
        <button
          type="button"
          className="text-primary-foreground transition-colors"
        >
          <UserCircle2 />
        </button>
      }
      width="w-56"
    >
      <div className="p-1">
        <HoverDropdownLabel>My Account</HoverDropdownLabel>
        <HoverDropdownSeparator />

        <HoverDropdownItem onClick={() => console.log("Profile clicked")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </HoverDropdownItem>

        <HoverDropdownItem onClick={() => console.log("Orders clicked")}>
          <Package className="mr-2 h-4 w-4" />
          <span>Orders</span>
        </HoverDropdownItem>

        <HoverDropdownItem onClick={() => console.log("Wishlist clicked")}>
          <Heart className="mr-2 h-4 w-4" />
          <span>Wishlist</span>
        </HoverDropdownItem>

        <HoverDropdownItem onClick={() => console.log("Payment clicked")}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Payment Methods</span>
        </HoverDropdownItem>

        <HoverDropdownItem onClick={() => console.log("Settings clicked")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </HoverDropdownItem>

        <HoverDropdownSeparator />

        <HoverDropdownItem onClick={() => console.log("Logout clicked")}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </HoverDropdownItem>
      </div>
    </HoverDropdown>
  );
}

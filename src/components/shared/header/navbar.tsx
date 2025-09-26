"use client";
import Link from "@/components/ui/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Truck,
  MapPin,
  Smartphone,
  Briefcase,
  Wrench,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Routes } from "@/constants/enums";
import type { ComponentType, SVGProps } from "react";

interface NavLink {
  id: string;
  title: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

// Navigation links including shop dropdown
export const navLinks: NavLink[] = [
  {
    id: crypto.randomUUID(),
    title: "الرئيسية",
    href: Routes.ROOT,
    icon: Home,
  },
  {
    id: crypto.randomUUID(),
    title: "سيارات",
    href: "/cars",
    icon: Truck,
  },
  {
    id: crypto.randomUUID(),
    title: "عقارات",
    href: "/real-estate",
    icon: MapPin,
  },
  {
    id: crypto.randomUUID(),
    title: "اجهزة",
    href: "/electronics",
    icon: Smartphone,
  },
  { id: crypto.randomUUID(), title: "وظائف", href: "/jobs", icon: Briefcase },
  { id: crypto.randomUUID(), title: "خدمات", href: "/services", icon: Wrench },
  {
    id: crypto.randomUUID(),
    title: "المزيد",
    href: "/more",
    icon: MoreHorizontal,
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="hidden lg:flex items-center justify-between gap-6 py-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <li key={link.id}>
              <Link
                href={link.href}
                className={cn(
                  "transition-colors",
                  pathname === link.href
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                )}
              >
                <span className="flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{link.title}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

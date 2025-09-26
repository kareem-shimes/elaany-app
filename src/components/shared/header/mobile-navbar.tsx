"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { MenuIcon, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "@/components/ui/link";
import { Routes } from "@/constants/enums";
import { usePathname } from "next/navigation";

// Navigation links including shop dropdown
export const navLinks = [
  {
    id: crypto.randomUUID(),
    title: "Shop",
    href: "#",
    children: [
      {
        id: crypto.randomUUID(),
        title: "All Products",
        href: "/products",
      },
      {
        id: crypto.randomUUID(),
        title: "Men's Fashion",
        href: "/categories/mens",
      },
      {
        id: crypto.randomUUID(),
        title: "Women's Fashion",
        href: "/categories/womens",
      },
      {
        id: crypto.randomUUID(),
        title: "Accessories",
        href: "/categories/accessories",
      },
      {
        id: crypto.randomUUID(),
        title: "Shoes",
        href: "/categories/shoes",
      },
      {
        id: crypto.randomUUID(),
        title: "Electronics",
        href: "/categories/electronics",
      },
      {
        id: crypto.randomUUID(),
        title: "Home & Garden",
        href: "/categories/home-garden",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: "On Sale",
    href: "/on-sale",
  },
  {
    id: crypto.randomUUID(),
    title: "New Arrivals",
    href: "/new-arrivals",
  },
  {
    id: crypto.randomUUID(),
    title: "Brands",
    href: "/brands",
  },
];

export default function MobileNavbar() {
  const pathname = usePathname();
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button className="element-center">
            <MenuIcon />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 p-0 border-border">
          <div className="flex h-full w-full flex-col p-4">
            <SheetHeader className="flex flex-row justify-between items-center">
              <SheetTitle>
                <Link href={Routes.ROOT} className="logo">
                  SHOP.CO
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex-1">
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className={`block py-2 px-4 rounded-lg transition-colors text-right ${
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary text-foreground"
                      }`}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="py-6 flex flex-col items-stretch gap-4 border-t border-border">
              <Link
                href="/auth/signin"
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full justify-center",
                })}
              >
                دخول
              </Link>
              <Link
                href="/auth/signup"
                className={buttonVariants({
                  className: "w-full justify-center",
                })}
              >
                انضم الان
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

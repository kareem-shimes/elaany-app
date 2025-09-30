import Link from "@/components/ui/link";
import { Routes } from "@/constants/enums";
import HeaderActions from "./header-actions";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-primary py-1">
      <div className="container flex items-center justify-between h-12">
        <Link href={Routes.ROOT} className="text-primary-foreground text-4xl">
          <Image
            src="/assets/images/logo.png"
            alt="Logo"
            width={100}
            height={100}
          />
        </Link>
        <HeaderActions />
      </div>
    </header>
  );
}

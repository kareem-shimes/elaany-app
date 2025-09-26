import Link from "@/components/ui/link";
import { Routes } from "@/constants/enums";
import Navbar from "./navbar";
import HeaderActions from "./header-actions";

export default function Header() {
  return (
    <header>
      <div className="container">
        <Navbar />
      </div>
      <div className="bg-primary">
        <div className="container flex items-center justify-between h-12">
          <Link href={Routes.ROOT} className="text-primary-foreground text-4xl">
            اعلاني
          </Link>
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}

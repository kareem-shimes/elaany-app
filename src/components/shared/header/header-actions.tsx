"use client";

import AuthLinks from "./auth-links";
import UserMenu from "./user-menu";
import { useAuth } from "@/features/auth";

export default function HeaderActions() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? <UserMenu /> : <AuthLinks />}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";
import { useAuth, LoginDialog } from "@/features/auth";
import UserMenu from "./user-menu";

export default function AuthLinks() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled>
          <User className="size-4" />
          جارٍ التحميل...
        </Button>
      </div>
    );
  }

  if (isAuthenticated) {
    return <UserMenu />;
  }

  return (
    <div className="flex items-center gap-2">
      <LoginDialog
        trigger={
          <Button variant="secondary" size="sm" className="gap-2">
            <LogIn className="size-4" />
            دخول
          </Button>
        }
      />
    </div>
  );
}

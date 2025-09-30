"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { AuthService } from "../services/auth-service";

interface UserDisplayProps {
  showFullName?: boolean;
  className?: string;
}

export function UserDisplay({
  showFullName = true,
  className = "",
}: UserDisplayProps) {
  const { user, signOut, isLoading } = useAuth();

  if (!user) {
    return null;
  }

  const displayName = AuthService.formatUserName(user.name);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showFullName && (
        <span className="text-sm text-muted-foreground">
          أهلاً، {displayName}
        </span>
      )}
      <Button
        variant="secondary"
        size="sm"
        onClick={signOut}
        disabled={isLoading}
      >
        <LogOut className="size-4" />
        خروج
      </Button>
    </div>
  );
}

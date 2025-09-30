"use client";

import Image from "next/image";
import { AuthUtils, type User } from "@/features/auth";

interface UserAvatarProps {
  user: User | null;
  size?: number;
  className?: string;
  showBorder?: boolean;
}

export function UserAvatar({
  user,
  size = 40,
  className = "",
  showBorder = false,
}: UserAvatarProps) {
  const avatarUrl = AuthUtils.getAvatarUrl(user, size);
  const initials = AuthUtils.getUserInitials(user);
  const displayName = AuthUtils.getDisplayName(user);

  const borderClass = showBorder ? "border-2 border-primary-foreground/20" : "";
  const sizeClass = `w-${Math.floor(size / 4)} h-${Math.floor(size / 4)}`;

  if (user?.image) {
    return (
      <Image
        src={avatarUrl}
        alt={displayName}
        width={size}
        height={size}
        className={`rounded-full ${borderClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-muted flex items-center justify-center text-sm font-medium ${borderClass} ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size < 32 ? "10px" : size < 48 ? "12px" : "14px",
      }}
    >
      {initials}
    </div>
  );
}

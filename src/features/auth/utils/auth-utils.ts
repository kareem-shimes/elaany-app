import { User } from "../types";

export const AuthUtils = {
  /**
   * Check if user has a specific role or permission
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasRole: (_user: User | null, _role: string): boolean => {
    // Placeholder for role-based access control
    // You can extend this based on your role system
    return false;
  },

  /**
   * Get user's initials for avatar display
   */
  getUserInitials: (user: User | null): string => {
    if (!user?.name) return "م"; // Default Arabic letter

    const names = user.name.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  },

  /**
   * Check if user's email is verified
   */
  isEmailVerified: (user: User | null): boolean => {
    // This would depend on your authentication provider
    // For now, we assume Google emails are verified
    return !!user?.email;
  },

  /**
   * Format user's display name for Arabic context
   */
  getDisplayName: (user: User | null, fallback = "مستخدم"): string => {
    if (!user?.name) return fallback;

    // Split name and get first part
    const firstName = user.name.trim().split(" ")[0];
    return firstName || fallback;
  },

  /**
   * Check if user profile is complete
   */
  isProfileComplete: (user: User | null): boolean => {
    return !!(user?.name && user?.email);
  },

  /**
   * Get user's avatar URL or generate default
   */
  getAvatarUrl: (user: User | null, size = 40): string => {
    if (user?.image) {
      return user.image;
    }

    // Generate default avatar with initials
    const initials = AuthUtils.getUserInitials(user);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      initials
    )}&size=${size}&background=random`;
  },
};

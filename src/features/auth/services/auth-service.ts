import { signIn, signOut, getSession } from "next-auth/react";

export class AuthService {
  static async signInWithGoogle() {
    try {
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  }

  static async signOut() {
    try {
      await signOut({
        callbackUrl: "/",
        redirect: false,
      });
    } catch (error) {
      console.error("Sign-out error:", error);
      throw error;
    }
  }

  static async getCurrentSession() {
    try {
      return await getSession();
    } catch (error) {
      console.error("Get session error:", error);
      return null;
    }
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static formatUserName(name: string | null | undefined): string {
    if (!name) return "مستخدم";

    // Handle Arabic names better
    const trimmedName = name.trim();
    const firstName = trimmedName.split(" ")[0];
    return firstName || "مستخدم";
  }
}

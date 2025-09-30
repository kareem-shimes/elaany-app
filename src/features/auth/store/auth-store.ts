import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";
import type { AuthState, AuthActions, User } from "../types";

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      signIn: async (provider = "google") => {
        const { setLoading, setError } = get();

        try {
          setLoading(true);
          setError(null);

          const result = await nextAuthSignIn(provider, {
            callbackUrl: "/",
            redirect: false,
          });

          if (result?.error) {
            setError(`خطأ في تسجيل الدخول: ${result.error}`);
          }
        } catch (error) {
          console.error("Sign in error:", error);
          setError("فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى.");
        } finally {
          setLoading(false);
        }
      },

      signOut: async () => {
        const { setLoading, setError, setUser } = get();

        try {
          setLoading(true);
          setError(null);

          await nextAuthSignOut({
            callbackUrl: "/",
            redirect: false,
          });

          // Clear user from store
          setUser(null);
        } catch (error) {
          console.error("Sign out error:", error);
          setError("فشل في تسجيل الخروج. يرجى المحاولة مرة أخرى.");
        } finally {
          setLoading(false);
        }
      },

      setUser: (user: User | null) => {
        set(() => ({
          user,
          isAuthenticated: !!user,
        }));
      },

      setLoading: (isLoading: boolean) => {
        set(() => ({ isLoading }));
      },

      setError: (error: string | null) => {
        set(() => ({ error }));
      },

      clearError: () => {
        set(() => ({ error: null }));
      },
    }),
    {
      name: "auth-store",
    }
  )
);

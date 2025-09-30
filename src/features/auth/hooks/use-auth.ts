"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "../store/auth-store";

export function useAuth() {
  const { data: session, status } = useSession();
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setLoading,
    clearError,
  } = useAuthStore();

  // Sync NextAuth session with Zustand store
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);

      if (session?.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sessionUser = session.user as any;
        setUser({
          id: sessionUser.id || session.user.email || "",
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        });
      } else {
        setUser(null);
      }
    }
  }, [session, status, setUser, setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || status === "loading",
    error,
    clearError,
    // Expose store actions
    signIn: useAuthStore((state) => state.signIn),
    signOut: useAuthStore((state) => state.signOut),
  };
}

import { useMemo } from "react";
import { usePage, router } from "@inertiajs/react";
import type { SharedProps } from "@/lib/types/shared_props";
import type { UseAuthUserReturn } from "./auth_user_type";

export const useAuthUser = (): UseAuthUserReturn => {
  const { auth, csrfToken } = usePage<SharedProps>().props;

  const isAuthenticated = auth?.isAuthenticated ?? false;
  const user = auth?.user ?? null;

  const requireAuth = () => {
    if (isAuthenticated) return true;

    router.visit("/auth?mode=login", {
      replace: true,
      preserveScroll: true,
    });

    return false;
  };

  const requireGuest = () => {
    if (!isAuthenticated) return true;

    router.visit("/dashboard", {
      replace: true,
      preserveScroll: true,
    });

    return false;
  };

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      csrfToken,
      requireAuth,
      requireGuest,
    }),
    [user, isAuthenticated, csrfToken]
  );
};

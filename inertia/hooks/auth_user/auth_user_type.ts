import type { AuthUser } from "@/lib/types/auth";

export type UseAuthUserReturn = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  csrfToken: string;

  /**
   * Helpers
   */
  requireAuth: () => boolean;
  requireGuest: () => boolean;
};

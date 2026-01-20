export type AuthUser = {
  id: number;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  timezone: string | null;
};

export type AuthResponse = {
  user: AuthUser;
};

export type SharedAuth = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};

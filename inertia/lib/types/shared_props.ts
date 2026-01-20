import type { SharedAuth } from "@/lib/types/auth";

export type SharedProps = {
  auth: SharedAuth;
  csrfToken: string;
};

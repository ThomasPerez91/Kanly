import { z } from "zod";
import { LoginSchema } from "./schema";
import type { AuthResponse } from "@/lib/types/auth";

export type InputType = z.infer<typeof LoginSchema>;
export type ReturnType = AuthResponse;

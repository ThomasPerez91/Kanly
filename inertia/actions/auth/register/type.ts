import { z } from "zod";
import { RegisterSchema } from "./schema";
import type { AuthResponse } from "@/lib/types/auth";

export type InputType = z.infer<typeof RegisterSchema>;
export type ReturnType = AuthResponse;

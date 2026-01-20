import { usePage } from "@inertiajs/react";
import type { SharedProps } from "@/lib/types/shared_props";

export const useSharedProps = () => {
  return usePage<SharedProps>().props;
};

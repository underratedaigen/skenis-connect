import { createContext, useContext } from "react";
import type { AdminSession } from "@/lib/types";

export const AdminUserContext = createContext<AdminSession | null>(null);

export function useAdminUser() {
  const user = useContext(AdminUserContext);

  if (!user) {
    throw new Error("Admin user context is missing.");
  }

  return user;
}

import type { ModuleKey } from "@/config/modules"

export type UserRole = "super-admin" | "admin" | "manager" | "staff" | "customer"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  permissions: ModuleKey[]
  createdAt: string
}

export const SUPER_ADMIN_ROLE: UserRole = "super-admin"

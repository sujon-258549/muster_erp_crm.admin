export type UserRole = "super-admin" | "admin" | "manager" | "staff" | "customer"

// `permissions` carries module keys exactly as they live in MODULES /
// PERMISSION_ITEMS (e.g. "employees", "departments", "customers.leads").
// Kept as `string[]` so adding/renaming sub-modules in config doesn't
// require a type-level update on the user shape.
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  permissions: string[]
  createdAt: string
}

export const SUPER_ADMIN_ROLE: UserRole = "super-admin"

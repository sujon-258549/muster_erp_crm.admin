// Roles are dynamic — admins create them at runtime via the Roles page.
// Only "SUPER_ADMIN" is treated specially (full-access bypass). Any other
// string is fine; permission checks go through `user.permissions`.
export type UserRole = string

// `permissions` carries per-module action lists — module key matches MODULES /
// PERMISSION_ITEMS (e.g. "employees", "departments"). Use `hasPermission()`
// in @/lib/permissions for module-level checks.
export interface PermissionRow {
  module: string
  actions: string[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  permissions: PermissionRow[]
  // Server-set flag: true means this user's role permissions just changed.
  // The /users/my-data endpoint clears it on read, so the next fetch will
  // be false. Frontend uses this to force a window reload.
  forceReload?: boolean
  createdAt: string
}

export const SUPER_ADMIN_ROLE: UserRole = "SUPER_ADMIN"

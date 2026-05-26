import { SUPER_ADMIN_ROLE, type User } from "@/types/user"

// Super-admin bypasses every permission check.
export const isSuperAdmin = (user: User | null | undefined): boolean =>
  user?.role === SUPER_ADMIN_ROLE

// `moduleKey` matches whatever was stored when granting the permission —
// usually a sub-module key like "employees", "departments", or "customers.leads".
export const hasPermission = (
  user: User | null | undefined,
  moduleKey: string,
): boolean => {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  return user.permissions?.includes(moduleKey) ?? false
}

export const hasAnyPermission = (
  user: User | null | undefined,
  moduleKeys: string[],
): boolean => {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  return moduleKeys.some((k) => user.permissions?.includes(k))
}

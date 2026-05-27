import { MODULES } from "@/config/modules"
import { SUPER_ADMIN_ROLE, type User } from "@/types/user"

// Super-admin bypasses every permission check.
export const isSuperAdmin = (user: User | null | undefined): boolean =>
  user?.role === SUPER_ADMIN_ROLE

// Module-level access — true if the user has any action granted on the
// module. Use `hasAction` for action-level checks.
export const hasPermission = (
  user: User | null | undefined,
  moduleKey: string,
): boolean => {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  return (
    user.permissions?.some(
      (p) => p.module === moduleKey && p.actions.length > 0,
    ) ?? false
  )
}

export const hasAnyPermission = (
  user: User | null | undefined,
  moduleKeys: string[],
): boolean => {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  return moduleKeys.some((k) => hasPermission(user, k))
}

// Action-level check — true if the user has the specific verb on the module.
export const hasAction = (
  user: User | null | undefined,
  moduleKey: string,
  action: string,
): boolean => {
  if (!user) return false
  if (isSuperAdmin(user)) return true
  return (
    user.permissions?.some(
      (p) => p.module === moduleKey && p.actions.includes(action),
    ) ?? false
  )
}

// First sidebar path the user can `read`. Used by login + RequirePermission
// to land users on a page they actually have access to. Super-admin lands
// on the first MODULES entry. Returns null when nothing is accessible.
export const firstAccessiblePath = (
  user: User | null | undefined,
): string | null => {
  if (!user) return null

  for (const mod of MODULES) {
    if (mod.children && mod.children.length > 0) {
      for (const c of mod.children) {
        if (isSuperAdmin(user) || hasAction(user, c.key, "read")) return c.path
      }
    } else if (isSuperAdmin(user) || hasAction(user, mod.key, "read")) {
      return mod.path
    }
  }
  return null
}

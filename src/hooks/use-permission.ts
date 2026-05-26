import { useAppSelector } from "@/redux/hooks"
import {
  hasAnyPermission,
  hasPermission,
  isSuperAdmin,
} from "@/lib/permissions"

export const useCurrentUser = () => useAppSelector((s) => s.auth.user)

export const useIsSuperAdmin = () => isSuperAdmin(useCurrentUser())

export const useHasPermission = (moduleKey: string) =>
  hasPermission(useCurrentUser(), moduleKey)

export const useHasAnyPermission = (moduleKeys: string[]) =>
  hasAnyPermission(useCurrentUser(), moduleKeys)

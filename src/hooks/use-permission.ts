import { useAppSelector } from "@/redux/hooks"
import {
  hasAnyPermission,
  hasPermission,
  isSuperAdmin,
} from "@/lib/permissions"
import type { ModuleKey } from "@/config/modules"

export const useCurrentUser = () => useAppSelector((s) => s.auth.user)

export const useIsSuperAdmin = () => isSuperAdmin(useCurrentUser())

export const useHasPermission = (moduleKey: ModuleKey) =>
  hasPermission(useCurrentUser(), moduleKey)

export const useHasAnyPermission = (moduleKeys: ModuleKey[]) =>
  hasAnyPermission(useCurrentUser(), moduleKeys)

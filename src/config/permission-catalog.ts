// Source of truth for the role-permission modal.
// Action strings match RolePermission.permissions rows + the backend
// requirePermission(moduleKey, action) middleware — keep them in sync.

import { MODULES } from "@/config/modules"
import type { LucideIcon } from "lucide-react"

export const CRUD = ["read", "create", "update", "delete"] as const

// Backend key → human label for the UI.
export const ACTION_LABEL: Record<string, string> = {
  read: "View",
  create: "Create",
  update: "Update",
  delete: "Delete",
  permission: "Permission",
  change_password: "Change Password",
  view_own: "View Your",
  publish: "Publish",
  upload: "Upload",
}

// Per-module overrides. Anything not listed falls back to CRUD.
const ACTION_OVERRIDES: Record<string, readonly string[]> = {
  roles: [...CRUD, "permission"],
  employees: [...CRUD, "change_password"],
  dashboard: ["read", "view_own", "permission"],
  settings: ["read", "update"],
  // Media library — view + upload + delete (no in-place update).
  media: ["read", "create", "delete"],
  // Notifications — view + delete (system creates them).
  notifications: ["read", "delete"],
  // Blog — full CRUD with optional publish action.
  blog: [...CRUD, "publish"],
  // Workflow guide — read-only docs page, no other actions make sense.
  workflow: ["read"],
}

export interface PermissionCatalogItem {
  key: string
  label: string
  icon: LucideIcon
  parentLabel?: string
  actions: readonly string[]
}

const resolveActions = (key: string): readonly string[] =>
  ACTION_OVERRIDES[key] ?? CRUD

// Parent with children → one item per child (parent dropped).
// Parent without children → one item using the parent's own key.
export const PERMISSION_CATALOG: PermissionCatalogItem[] = MODULES.flatMap(
  (mod): PermissionCatalogItem[] =>
    mod.children && mod.children.length > 0
      ? mod.children.map((child) => ({
          key: child.key,
          label: child.label,
          icon: mod.icon,
          parentLabel: mod.label,
          actions: resolveActions(child.key),
        }))
      : [
          {
            key: mod.key,
            label: mod.label,
            icon: mod.icon,
            actions: resolveActions(mod.key),
          },
        ],
)

export const DISTINCT_ACTIONS: string[] = Array.from(
  new Set(PERMISSION_CATALOG.flatMap((item) => item.actions)),
)

export const TOTAL_PERMISSION_COUNT: number = PERMISSION_CATALOG.reduce(
  (sum, item) => sum + item.actions.length,
  0,
)

export const getModuleActions = (key: string): readonly string[] =>
  resolveActions(key)

// Permission domain types. A RolePermission row is the join between a role
// and a module, with the set of allowed actions on that module.

export type PermissionAction = "create" | "read" | "update" | "delete"

export const PERMISSION_ACTIONS: PermissionAction[] = [
  "create",
  "read",
  "update",
  "delete",
]

export interface RolePermission {
  id: string
  roleId: string | null
  module: string | null
  permissions: string[]
  createdAt: string
  updatedAt: string
  // Some endpoints include the joined role:
  role?: { id: string; role: string | null } | null
}

export interface RolePermissionPayload {
  roleId: string
  module: string
  permissions: string[]
}

export interface RolePermissionListParams {
  page?: number
  limit?: number
  searchTerm?: string
  roleId?: string
  module?: string
}

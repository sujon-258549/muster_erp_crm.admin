import type { PermissionRow, User, UserRole } from "@/types/user"

// Backend payload can be one of several shapes — flatten + map into the
// shape the rest of the app expects.

interface BackendUser {
  id?: string | number
  email?: string
  name?: string
  createdAt?: string
  permissions?: PermissionRow[]
  forceReload?: boolean
  role?: string | { role?: string }
  profile?: {
    name?: string
    profilePhoto?: string | null
    photo?: string | null
  }
  [key: string]: unknown
}

// Backend may send the role as a string ("SUPER_ADMIN") or a joined object
// ({ role: "SUPER_ADMIN" }). Always return uppercase so `isSuperAdmin` can
// rely on `=== "SUPER_ADMIN"` regardless of what the DB happens to hold.
const normalizeRole = (raw: BackendUser["role"]): UserRole => {
  const value =
    typeof raw === "string" ? raw : typeof raw === "object" ? raw?.role : ""
  return (value ?? "").toUpperCase().replace(/-/g, "_")
}

export function normalizeUser(raw: BackendUser | null | undefined): User {
  if (!raw) {
    return {
      id: "",
      name: "User",
      email: "",
      role: "",
      permissions: [],
      createdAt: new Date().toISOString(),
    }
  }

  return {
    id: String(raw.id ?? ""),
    name: raw.profile?.name ?? raw.name ?? raw.email ?? "User",
    email: raw.email ?? "",
    avatar:
      raw.profile?.profilePhoto ?? raw.profile?.photo ?? undefined,
    role: normalizeRole(raw.role),
    permissions: raw.permissions ?? [],
    forceReload: raw.forceReload ?? false,
    createdAt: raw.createdAt ?? new Date().toISOString(),
  }
}

import type { ModuleKey } from "@/config/modules"
import type { User, UserRole } from "@/types/user"

// Backend payload can be one of several shapes — flatten + map into the
// shape the rest of the app expects.

interface BackendUser {
  id?: string | number
  email?: string
  name?: string
  createdAt?: string
  permissions?: ModuleKey[] | string[]
  role?: string | { role?: string }
  profile?: {
    name?: string
    profilePhoto?: string | null
    photo?: string | null
  }
  [key: string]: unknown
}

// "SUPER_ADMIN" -> "super-admin", "ADMIN" -> "admin", "manager" -> "manager"
const normalizeRole = (raw: BackendUser["role"]): UserRole => {
  const value =
    typeof raw === "string" ? raw : typeof raw === "object" ? raw?.role : ""
  if (!value) return "staff"
  const slug = value.toLowerCase().replace(/_/g, "-")
  const known: UserRole[] = ["super-admin", "admin", "manager", "staff", "customer"]
  return (known.find((r) => r === slug) ?? "staff") as UserRole
}

export function normalizeUser(raw: BackendUser | null | undefined): User {
  if (!raw) {
    return {
      id: "",
      name: "User",
      email: "",
      role: "staff",
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
    permissions: (raw.permissions ?? []) as ModuleKey[],
    createdAt: raw.createdAt ?? new Date().toISOString(),
  }
}

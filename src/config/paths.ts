import { getModule, type ModuleKey } from "@/config/modules"

// Narrow ModuleKey → guaranteed string path from the registry. If a module
// key is missing from the registry, fail loudly during dev.
const mp = (key: ModuleKey): string => {
  const mod = getModule(key)
  if (!mod) throw new Error(`Module "${key}" not registered in MODULES`)
  return mod.path
}

export const ROUTES = {
  ROOT: "/",
  // Keep these in sync with the route declarations in src/routes/index.tsx.
  AUTH: {
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
  },
  MODULES: {
    DASHBOARD: mp("dashboard"),
    USERS: mp("users"),
    CUSTOMERS: mp("customers"),
    PRODUCTS: mp("products"),
    SETTINGS: mp("settings"),
  },
  EMPLOYEES: {
    LIST: "/employees",
    CREATE: "/employees/new",
    EDIT: (id: string) => `/employees/${id}/edit`,
    DEPARTMENTS: "/employees/departments",
    ROLES: "/employees/roles",
    DESIGNATIONS: "/employees/designations",
  },
  NOT_FOUND: "*",
} as const

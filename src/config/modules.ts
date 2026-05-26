// Single source of truth for every module in the app.
// Each module's `key` doubles as its permission name — granting a user
// the "customers" permission means they can access the customers module.
//
// Adding a new module:
//   1. Add an entry below
//   2. Create the page + routes under src/pages/<key>/
//   3. Spread <key>Routes into src/routes/index.tsx
// The sidebar + permission system pick it up automatically.

import {
  LayoutDashboard,
  Users,
  Package,
  Warehouse,
  FileText,
  Settings,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type ModuleKey =
  | "dashboard"
  | "users"
  | "customers"
  | "products"
  | "inventory"
  | "invoices"
  | "settings";

export type ModuleGroup = "Overview" | "CRM" | "ERP" | "System";

// A child entry doubles as its own permission item when `key` is set —
// the permission modal then drops the parent in favor of these children.
// Use a stable key (kebab/dot case) so backend rows survive label edits.
export interface AppModuleChild {
  key: string;
  label: string;
  path: string;
}

export interface AppModule {
  key: ModuleKey;
  label: string;
  path: string;
  icon: LucideIcon;
  children?: AppModuleChild[];
}

export const MODULES: AppModule[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "customers",
    label: "Customers",
    path: "/customers",
    icon: Users,
    children: [
      { key: "customers.list", label: "All Customers", path: "/customers" },
      { key: "customers.new", label: "New Customer", path: "/customers/new" },
      {
        key: "customers.leads",
        label: "Leads",
        path: "/customers?status=lead",
      },
    ],
  },
  {
    key: "products",
    label: "Products",
    path: "/products",
    icon: Package,
    children: [
      { key: "products.list", label: "All Products", path: "/products" },
      { key: "products.new", label: "New Product", path: "/products/new" },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    path: "/inventory",
    icon: Warehouse,
  },
  {
    key: "invoices",
    label: "Invoices",
    path: "/invoices",
    icon: FileText,
  },
  {
    key: "users",
    label: "Employee Management",
    path: "/employees",
    icon: UsersRound,
    children: [
      { key: "employees", label: "Employee List", path: "/employees" },
      {
        key: "departments",
        label: "Department List",
        path: "/employees/departments",
      },
      { key: "roles", label: "Role List", path: "/employees/roles" },
      {
        key: "designations",
        label: "Designation List",
        path: "/employees/designations",
      },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export const MODULE_KEYS = MODULES.map((m) => m.key);

export const MODULE_GROUPS: ModuleGroup[] = [
  "Overview",
  "CRM",
  "ERP",
  "System",
];

export const getModule = (key: ModuleKey): AppModule | undefined =>
  MODULES.find((m) => m.key === key);

// Note: the role-permission modal flattens MODULES into per-sub-module
// permission items with custom action lists. See
// `src/config/permission-catalog.ts` for that derivation.

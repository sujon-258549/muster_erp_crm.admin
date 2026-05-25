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

export interface AppModule {
  key: ModuleKey;
  label: string;
  path: string;
  icon: LucideIcon;
  children?: { label: string; path: string }[];
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
      { label: "All Customers", path: "/customers" },
      { label: "New Customer", path: "/customers/new" },
      { label: "Leads", path: "/customers?status=lead" },
    ],
  },
  {
    key: "products",
    label: "Products",
    path: "/products",
    icon: Package,
    children: [
      { label: "All Products", path: "/products" },
      { label: "New Product", path: "/products/new" },
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
      { label: "Employee List", path: "/employees" },
      { label: "Department List", path: "/employees/departments" },
      { label: "Role List", path: "/employees/roles" },
      { label: "Designation List", path: "/employees/designations" },
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

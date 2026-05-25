import { createBrowserRouter, Navigate } from "react-router-dom"

// ─────────────────────────────────────────────────────────────────────────────
// Route guards — only-here-for-routing helpers.
// ─────────────────────────────────────────────────────────────────────────────
import ProtectedRoute from "./ProtectedRoute"
import PublicRoute from "./PublicRoute"

// ─────────────────────────────────────────────────────────────────────────────
// Layouts
// ─────────────────────────────────────────────────────────────────────────────
import AuthLayout from "@/layouts/auth-layout"
import DashboardLayout from "@/layouts/dashboard-layout"

// ─────────────────────────────────────────────────────────────────────────────
// Auth pages
// ─────────────────────────────────────────────────────────────────────────────
import Login from "@/pages/auth/login-page"

// ─────────────────────────────────────────────────────────────────────────────
// Common pages (404, error, loading)
// ─────────────────────────────────────────────────────────────────────────────
import NotFound from "@/pages/common/NotFound"
import ErrorPage from "@/pages/common/ErrorPage"

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────
import Dashboard from "@/pages/dashboard/dashboard-page"

// ─────────────────────────────────────────────────────────────────────────────
// Employee Management — every page used by the Employee Management mega menu.
// ─────────────────────────────────────────────────────────────────────────────
import EmployeeList from "@/pages/employee/EmployeeList"
import EmployeeCreate from "@/pages/employee/EmployeeCreate"
import DepartmentList from "@/pages/department/DepartmentList"
import RoleList from "@/pages/role/RoleList"
import DesignationList from "@/pages/designation/DesignationList"

// ─────────────────────────────────────────────────────────────────────────────
// CRM / ERP module placeholders
// ─────────────────────────────────────────────────────────────────────────────
import CustomerList from "@/pages/customers/customer-list-page"
import ProductList from "@/pages/products/product-list-page"
import InventoryPage from "@/pages/inventory/inventory-page"
import InvoiceList from "@/pages/invoices/invoice-list-page"
import SettingsPage from "@/pages/settings/settings-page"

// ─────────────────────────────────────────────────────────────────────────────
// Router
//
// Branch layout:
//   /login              → PublicRoute → AuthLayout → Login
//   /                   → ProtectedRoute → DashboardLayout → every feature page
//     *                 → 404 fallback (only matches inside the protected tree)
// ─────────────────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  // Public auth screen. Signed-in users are bounced to /dashboard.
  {
    path: "/login",
    element: (
      <PublicRoute>
        <AuthLayout>
          <Login />
        </AuthLayout>
      </PublicRoute>
    ),
    errorElement: <ErrorPage />,
  },

  // Protected app. Sign-in required; everything renders inside DashboardLayout.
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      // Dashboard — default landing after login.
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },

      // Employee Management
      { path: "employees", element: <EmployeeList /> },
      { path: "employees/new", element: <EmployeeCreate /> },
      { path: "employees/departments", element: <DepartmentList /> },
      { path: "employees/roles", element: <RoleList /> },
      { path: "employees/designations", element: <DesignationList /> },

      // Back-compat: legacy /users URLs land in the new employee list.
      { path: "users", element: <Navigate to="/employees" replace /> },

      // CRM / ERP module placeholders
      { path: "customers", element: <CustomerList /> },
      { path: "products", element: <ProductList /> },
      { path: "inventory", element: <InventoryPage /> },
      { path: "invoices", element: <InvoiceList /> },
      { path: "settings", element: <SettingsPage /> },

      // 404 — any unmatched URL inside the protected tree.
      { path: "*", element: <NotFound /> },
    ],
  },
])

import { createBrowserRouter, Navigate } from "react-router-dom"
import { useCurrentUser } from "@/hooks/use-permission"
import { firstAccessiblePath, isSuperAdmin } from "@/lib/permissions"
import { ROUTES } from "@/config/paths"

// "/" entry: redirect to the first module the signed-in user can read.
// Super-admin lands on /dashboard; users with no grants go to /access-denied.
function SmartIndex() {
  const user = useCurrentUser()
  if (isSuperAdmin(user)) return <Navigate to={ROUTES.MODULES.DASHBOARD} replace />
  const target = firstAccessiblePath(user)
  return <Navigate to={target ?? "/access-denied"} replace />
}

// ─────────────────────────────────────────────────────────────────────────────
// Route guards — only-here-for-routing helpers.
// ─────────────────────────────────────────────────────────────────────────────
import ProtectedRoute from "./ProtectedRoute"
import PublicRoute from "./PublicRoute"
import RequirePermission from "./RequirePermission"

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
import AccessDenied from "@/pages/common/AccessDenied"

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────
import Dashboard from "@/pages/dashboard/dashboard-page"

// ─────────────────────────────────────────────────────────────────────────────
// Employee Management — every page used by the Employee Management mega menu.
// ─────────────────────────────────────────────────────────────────────────────
import EmployeeList from "@/pages/employee/EmployeeList"
import EmployeeCreate from "@/pages/employee/EmployeeCreate"
import EmployeeEdit from "@/pages/employee/EmployeeEdit"
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
import MainBranchList from "@/pages/branches/MainBranchList"
import SubBranchList from "@/pages/branches/SubBranchList"
import BranchAdminList from "@/pages/branch-admins/BranchAdminList"
import CategoryList from "@/pages/categories/CategoryList"
import SubCategoryList from "@/pages/categories/SubCategoryList"
import BlogList from "@/pages/blog/BlogList"
import MediaLibrary from "@/pages/media/MediaLibrary"
import WorkTypeList from "@/pages/work-types/WorkTypeList"
import SubscriptionList from "@/pages/subscriptions/SubscriptionList"
import PlanList from "@/pages/subscriptions/PlanList"
import NotificationList from "@/pages/notifications/NotificationList"
import WorkflowPage from "@/pages/workflow/WorkflowPage"

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
      // Index "/" routes the user to their first accessible module.
      { index: true, element: <SmartIndex /> },

      // Dashboard — needs explicit `dashboard.read` permission like any
      // other module. Super-admins bypass.
      {
        path: "dashboard",
        element: (
          <RequirePermission moduleKey="dashboard">
            <Dashboard />
          </RequirePermission>
        ),
      },

      // Shown when the user is signed in but has no module access (or hit
      // a route they don't have permission for).
      { path: "access-denied", element: <AccessDenied /> },

      // Employee Management — each sub-module guarded by its own key.
      // Keys match what the permission modal writes to the backend.
      {
        path: "employees",
        element: (
          <RequirePermission moduleKey="employees">
            <EmployeeList />
          </RequirePermission>
        ),
      },
      {
        path: "employees/new",
        element: (
          <RequirePermission moduleKey="employees" action="create">
            <EmployeeCreate />
          </RequirePermission>
        ),
      },
      {
        path: "employees/:id/edit",
        element: (
          <RequirePermission moduleKey="employees" action="update">
            <EmployeeEdit />
          </RequirePermission>
        ),
      },
      {
        path: "employees/departments",
        element: (
          <RequirePermission moduleKey="departments">
            <DepartmentList />
          </RequirePermission>
        ),
      },
      {
        path: "employees/roles",
        element: (
          <RequirePermission moduleKey="roles">
            <RoleList />
          </RequirePermission>
        ),
      },
      {
        path: "employees/designations",
        element: (
          <RequirePermission moduleKey="designations">
            <DesignationList />
          </RequirePermission>
        ),
      },

      // Back-compat: legacy /users URLs land in the new employee list.
      { path: "users", element: <Navigate to="/employees" replace /> },

      // CRM / ERP module placeholders — parents without children use their
      // own key; parents with children use the "list" child key.
      {
        path: "customers",
        element: (
          <RequirePermission moduleKey="customers.list">
            <CustomerList />
          </RequirePermission>
        ),
      },
      {
        path: "products",
        element: (
          <RequirePermission moduleKey="products.list">
            <ProductList />
          </RequirePermission>
        ),
      },
      {
        path: "inventory",
        element: (
          <RequirePermission moduleKey="inventory">
            <InventoryPage />
          </RequirePermission>
        ),
      },
      {
        path: "invoices",
        element: (
          <RequirePermission moduleKey="invoices">
            <InvoiceList />
          </RequirePermission>
        ),
      },
      {
        path: "settings",
        element: (
          <RequirePermission moduleKey="settings">
            <SettingsPage />
          </RequirePermission>
        ),
      },

      // Branches
      {
        path: "branches",
        element: (
          <RequirePermission moduleKey="branches.list">
            <MainBranchList />
          </RequirePermission>
        ),
      },
      {
        path: "branches/sub",
        element: (
          <RequirePermission moduleKey="subbranches.list">
            <SubBranchList />
          </RequirePermission>
        ),
      },
      {
        path: "branches/admins",
        element: (
          <RequirePermission moduleKey="branchAdmins">
            <BranchAdminList />
          </RequirePermission>
        ),
      },

      // Categories
      {
        path: "categories",
        element: (
          <RequirePermission moduleKey="categories.list">
            <CategoryList />
          </RequirePermission>
        ),
      },
      {
        path: "categories/sub",
        element: (
          <RequirePermission moduleKey="subcategories.list">
            <SubCategoryList />
          </RequirePermission>
        ),
      },

      // Blog
      {
        path: "blog",
        element: (
          <RequirePermission moduleKey="blog">
            <BlogList />
          </RequirePermission>
        ),
      },

      // Media Library
      {
        path: "media",
        element: (
          <RequirePermission moduleKey="media">
            <MediaLibrary />
          </RequirePermission>
        ),
      },

      // Work Types
      {
        path: "work-types",
        element: (
          <RequirePermission moduleKey="workTypes">
            <WorkTypeList />
          </RequirePermission>
        ),
      },

      // Subscriptions
      {
        path: "subscriptions",
        element: (
          <RequirePermission moduleKey="subscriptions.list">
            <SubscriptionList />
          </RequirePermission>
        ),
      },
      {
        path: "subscriptions/plans",
        element: (
          <RequirePermission moduleKey="subscriptions.plans">
            <PlanList />
          </RequirePermission>
        ),
      },

      // Notifications
      {
        path: "notifications",
        element: (
          <RequirePermission moduleKey="notifications">
            <NotificationList />
          </RequirePermission>
        ),
      },

      // Workflow Guide — Platform Super Admin playbook. Only super-admins
      // (or anyone explicitly granted `workflow.read`) can see it.
      {
        path: "workflow",
        element: (
          <RequirePermission moduleKey="workflow">
            <WorkflowPage />
          </RequirePermission>
        ),
      },

      // 404 — any unmatched URL inside the protected tree.
      { path: "*", element: <NotFound /> },
    ],
  },
])

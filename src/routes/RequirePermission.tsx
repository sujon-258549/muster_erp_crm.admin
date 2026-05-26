import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useCurrentUser } from "@/hooks/use-permission"
import { hasPermission, isSuperAdmin } from "@/lib/permissions"
import { ROUTES } from "@/config/paths"

interface Props {
  // Module key as stored in `user.permissions` — same value the permission
  // modal saves to the backend (e.g. "employees", "departments",
  // "customers.leads").
  moduleKey: string
  children: ReactNode
}

// Per-route permission gate. Wraps a route element; renders the page only
// when the signed-in user has access. Super-admins bypass the check.
//
// Usage:
//   { path: "employees", element: (
//       <RequirePermission moduleKey="employees">
//         <EmployeeList />
//       </RequirePermission>
//   ) }
export default function RequirePermission({ moduleKey, children }: Props) {
  const user = useCurrentUser()

  // Onboarding fallback: a freshly-created account with no explicit grants
  // yet still lands on the dashboard — matches the sidebar's behavior.
  const hasNoExplicitGrants = (user?.permissions?.length ?? 0) === 0
  if (isSuperAdmin(user) || hasNoExplicitGrants) {
    return <>{children}</>
  }

  if (!hasPermission(user, moduleKey)) {
    return <Navigate to={ROUTES.MODULES.DASHBOARD} replace />
  }

  return <>{children}</>
}

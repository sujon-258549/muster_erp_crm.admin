import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useCurrentUser } from "@/hooks/use-permission"
import {
  firstAccessiblePath,
  hasAction,
  isSuperAdmin,
} from "@/lib/permissions"

interface Props {
  // Module key as stored in `user.permissions` — same value the permission
  // modal saves to the backend (e.g. "employees", "departments",
  // "customers.leads").
  moduleKey: string
  // Action required to view the route. Defaults to "read".
  action?: string
  children: ReactNode
}

// Per-route permission gate. Renders the page only when the user has the
// given action on the module. Super-admins bypass the check.
//
// On denial:
//   - If the user has access to some OTHER module → redirect there.
//   - If they have access to nothing at all → send to /access-denied.
export default function RequirePermission({
  moduleKey,
  action = "read",
  children,
}: Props) {
  const user = useCurrentUser()
  const location = useLocation()

  if (isSuperAdmin(user)) return <>{children}</>

  if (hasAction(user, moduleKey, action)) return <>{children}</>

  const fallback = firstAccessiblePath(user)
  // Guard against redirect loops: if the fallback path is the route we're
  // already on, bail to /access-denied instead.
  if (fallback && fallback !== location.pathname) {
    return <Navigate to={fallback} replace />
  }
  return <Navigate to="/access-denied" replace />
}

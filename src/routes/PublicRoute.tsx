import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAppSelector } from "@/redux/hooks"
import { ROUTES } from "@/config/paths"

interface Props {
  children: ReactNode
}

// Used for auth-only pages (login, forgot password). If the user is already
// signed in we send them straight to the dashboard instead of letting them
// see the login screen again.
export default function PublicRoute({ children }: Props) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to={ROUTES.MODULES.DASHBOARD} replace />
  }

  return <>{children}</>
}

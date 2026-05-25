import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAppSelector } from "@/redux/hooks"
import { ROUTES } from "@/config/paths"

interface Props {
  children: ReactNode
}

// Guards every authenticated section. Wrap the dashboard layout (or any
// page) like `<ProtectedRoute><MainLayout /></ProtectedRoute>`.
// When the user is not signed in, kick them to the login page while
// remembering the URL they tried to visit so we can return after auth.
export default function ProtectedRoute({ children }: Props) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />
    )
  }

  return <>{children}</>
}

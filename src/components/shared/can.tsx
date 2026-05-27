import type { ReactNode } from "react"
import { useCurrentUser } from "@/hooks/use-permission"
import { hasAction, isSuperAdmin } from "@/lib/permissions"

interface Props {
  module: string
  action: string
  children: ReactNode
  // Optional content to render when the user is denied. Defaults to nothing.
  fallback?: ReactNode
}

// Permission gate. Wrap any UI (button, link, section) that should only be
// visible to users with the given module+action grant. Super-admins always
// see the children.
//
// Usage:
//   <Can module="employees" action="create">
//     <Button onClick={...}>Create Employee</Button>
//   </Can>
export function Can({ module, action, children, fallback = null }: Props) {
  const user = useCurrentUser()
  if (isSuperAdmin(user)) return <>{children}</>
  if (!hasAction(user, module, action)) return <>{fallback}</>
  return <>{children}</>
}

import { Link } from "react-router-dom"
import { ShieldAlert } from "lucide-react"
import { useAppDispatch } from "@/redux/hooks"
import { performLogout } from "@/redux/features/auth/auth-slice"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config/paths"

export default function AccessDenied() {
  const dispatch = useAppDispatch()
  return (
    <div className="grid min-h-[60vh] place-items-center px-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-7" />
        </div>
        <h1 className="text-2xl font-semibold">No access</h1>
        <p className="text-sm text-muted-foreground">
          Your role doesn&apos;t have permission for the requested page. Ask
          your administrator to grant you the right module access.
        </p>
        <div className="flex justify-center gap-2 pt-2">
          <Button variant="outline" onClick={() => dispatch(performLogout())} asChild>
            <Link to={ROUTES.AUTH.LOGIN}>Sign out</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

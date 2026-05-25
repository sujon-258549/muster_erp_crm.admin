import { useRouteError, Link } from "react-router-dom"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { H2, Text } from "@/components/shared"
import { ROUTES } from "@/config/paths"

interface RouteErrorShape {
  status?: number
  statusText?: string
  message?: string
  data?: unknown
}

function readError(err: unknown): { title: string; message: string } {
  if (err && typeof err === "object") {
    const e = err as RouteErrorShape
    if (e.status) {
      return {
        title: `${e.status} ${e.statusText ?? "Error"}`,
        message:
          typeof e.data === "string"
            ? e.data
            : (e.message ?? "Something went wrong loading this page."),
      }
    }
    if (e.message)
      return { title: "Something went wrong", message: e.message }
  }
  return {
    title: "Something went wrong",
    message: "An unexpected error occurred. Please try again.",
  }
}

// Route-level error boundary. Attached to the root route via `errorElement`
// so any throw inside a page renders this instead of a blank screen.
export default function ErrorPage() {
  const err = useRouteError()
  const { title, message } = readError(err)

  return (
    <div className="grid min-h-screen place-items-center bg-muted/40 p-6 text-center">
      <div className="max-w-md space-y-4">
        <AlertTriangle className="mx-auto size-12 text-destructive/70" />
        <H2>{title}</H2>
        <Text tone="muted">{message}</Text>
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload
          </Button>
          <Button asChild>
            <Link to={ROUTES.MODULES.DASHBOARD}>Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

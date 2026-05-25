import { Link } from "react-router-dom"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { H1, Text } from "@/components/shared"
import { ROUTES } from "@/config/paths"

// Rendered for any unmatched route (see ROUTES.NOT_FOUND).
export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-muted/40 p-6 text-center">
      <div className="space-y-4">
        <FileQuestion className="mx-auto size-12 text-muted-foreground/60" />
        <H1 size="h1">404</H1>
        <Text tone="muted">The page you are looking for does not exist.</Text>
        <Button asChild>
          <Link to={ROUTES.MODULES.DASHBOARD}>Back to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}

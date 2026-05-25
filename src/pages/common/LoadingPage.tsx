import { Loader2 } from "lucide-react"
import { Text } from "@/components/shared"

// Full-screen loading screen — used as the Suspense fallback when a lazy
// page chunk is downloading, and anywhere else we need a centered loader.
export default function LoadingPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="size-7 animate-spin" />
        <Text size="sm" tone="muted">
          Loading…
        </Text>
      </div>
    </div>
  )
}

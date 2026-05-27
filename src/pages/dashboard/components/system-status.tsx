import { Activity, CheckCircle2, AlertCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Health = "up" | "warn" | "down"

interface Service {
  name: string
  health: Health
  meta: string
}

const SERVICES: Service[] = [
  { name: "API server",      health: "up",   meta: "Latency 38ms" },
  { name: "Database",        health: "up",   meta: "Replication lag 0s" },
  { name: "Email gateway",   health: "warn", meta: "Rate limit 80%" },
  { name: "Payment gateway", health: "up",   meta: "Last txn 12s ago" },
  { name: "File storage",    health: "up",   meta: "Usage 62%" },
]

const TONE: Record<Health, { dot: string; label: string; icon: typeof CheckCircle2 }> = {
  up:   { dot: "bg-emerald-500", label: "Operational",  icon: CheckCircle2 },
  warn: { dot: "bg-amber-500",   label: "Degraded",     icon: AlertCircle },
  down: { dot: "bg-rose-500",    label: "Down",         icon: AlertCircle },
}

export function SystemStatus() {
  const downCount = SERVICES.filter((s) => s.health !== "up").length
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-4 text-primary" /> System Status
        </CardTitle>
        <CardDescription>
          {downCount === 0
            ? "All systems operational."
            : `${downCount} service${downCount === 1 ? "" : "s"} need attention.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {SERVICES.map((s) => {
          const Icon = TONE[s.health].icon
          return (
            <div
              key={s.name}
              className="flex items-center gap-3 rounded-md border border-border/60 p-2.5"
            >
              <span className={cn("size-2 shrink-0 rounded-full", TONE[s.health].dot)} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-[11px] text-muted-foreground">{s.meta}</div>
              </div>
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  s.health === "up"
                    ? "text-emerald-500"
                    : s.health === "warn"
                      ? "text-amber-500"
                      : "text-rose-500",
                )}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

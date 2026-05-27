import { CalendarDays, TrendingUp } from "lucide-react"
import { useCurrentUser } from "@/hooks/use-permission"

const todayString = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

export function DashboardHeader() {
  const user = useCurrentUser()
  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
  })()

  return (
    <div className="relative overflow-hidden rounded-md border bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-5 shadow-xs">
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {greeting}, {user?.name ?? "there"} 👋
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="size-4" /> {todayString()}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          <TrendingUp className="size-4 text-emerald-600" />
          Business is up <span className="font-semibold text-foreground">12.4%</span>{" "}
          this month
        </div>
      </div>
      <TrendingUp
        aria-hidden
        className="absolute -right-6 -bottom-6 size-32 text-primary/10"
      />
    </div>
  )
}

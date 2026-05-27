import { CalendarDays, Clock } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Event {
  day: string
  month: string
  title: string
  time: string
  tone: "violet" | "sky" | "emerald" | "amber"
}

const EVENTS: Event[] = [
  { day: "12", month: "Oct", title: "Quarterly Board Meeting", time: "10:00 AM",   tone: "violet" },
  { day: "15", month: "Oct", title: "Product Launch — Watch X2", time: "2:00 PM", tone: "sky" },
  { day: "18", month: "Oct", title: "Team Outing — Cox's Bazar", time: "All day",  tone: "emerald" },
  { day: "22", month: "Oct", title: "Vendor Negotiation Call",  time: "11:30 AM", tone: "amber" },
]

const TONE: Record<Event["tone"], string> = {
  violet:  "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  sky:     "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  amber:   "bg-amber-500/10 text-amber-700 dark:text-amber-400",
}

export function UpcomingEvents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" /> Upcoming Events
        </CardTitle>
        <CardDescription>Calendar for the next 2 weeks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {EVENTS.map((e) => (
          <div
            key={e.title}
            className="flex items-center gap-3 rounded-md border border-border/60 p-2.5"
          >
            <div
              className={cn(
                "grid size-12 shrink-0 place-items-center rounded-md text-center",
                TONE[e.tone],
              )}
            >
              <div className="text-base font-bold leading-none">{e.day}</div>
              <div className="text-[10px] uppercase tracking-wider opacity-80">
                {e.month}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{e.title}</div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="size-3" /> {e.time}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

import {
  CheckCircle2,
  CircleDollarSign,
  FileText,
  ShieldCheck,
  UserPlus,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Activity {
  id: string
  icon: LucideIcon
  tone: "emerald" | "sky" | "violet" | "amber" | "rose"
  title: string
  description: string
  time: string
}

const ACTIVITIES: Activity[] = [
  {
    id: "1",
    icon: UserPlus,
    tone: "emerald",
    title: "New employee onboarded",
    description: "Md. Rakib Hasan joined the Engineering team",
    time: "2 minutes ago",
  },
  {
    id: "2",
    icon: CircleDollarSign,
    tone: "sky",
    title: "Invoice #INV-2031 paid",
    description: "৳45,000 received from ABC Traders",
    time: "12 minutes ago",
  },
  {
    id: "3",
    icon: ShieldCheck,
    tone: "violet",
    title: "Role permissions updated",
    description: "MANAGER role granted 3 new modules",
    time: "1 hour ago",
  },
  {
    id: "4",
    icon: FileText,
    tone: "amber",
    title: "Quote request received",
    description: "5-product quotation from XYZ Ltd.",
    time: "3 hours ago",
  },
  {
    id: "5",
    icon: CheckCircle2,
    tone: "emerald",
    title: "Order #ORD-8821 shipped",
    description: "Out for delivery to Chittagong",
    time: "Yesterday",
  },
]

const TONE_CLASS: Record<Activity["tone"], string> = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
}

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>
          Last 5 events across employees, billing, and roles.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {ACTIVITIES.map((a) => {
          const Icon = a.icon
          return (
            <div key={a.id} className="flex items-start gap-3">
              <div
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full",
                  TONE_CLASS[a.tone],
                )}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {a.time}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {a.description}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

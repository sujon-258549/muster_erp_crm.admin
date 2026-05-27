import { Trophy } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserAvatar } from "@/components/shared"
import { cn } from "@/lib/utils"

interface Row {
  rank: number
  name: string
  role: string
  score: number
}

const ROWS: Row[] = [
  { rank: 1, name: "Sajjad Hossain", role: "Senior Sales Executive", score: 96 },
  { rank: 2, name: "Tahmina Akter", role: "Customer Success", score: 92 },
  { rank: 3, name: "Md. Rakib", role: "Engineering Lead", score: 89 },
  { rank: 4, name: "Nusrat Jahan", role: "Sales Executive", score: 85 },
  { rank: 5, name: "Imran Khan", role: "Operations Manager", score: 82 },
]

const RANK_TONE: Record<number, string> = {
  1: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  2: "bg-slate-400/15 text-slate-700 dark:text-slate-300",
  3: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
}

export function TopEmployees() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="size-4 text-amber-500" /> Top Performers
        </CardTitle>
        <CardDescription>
          Highest-scoring employees this month.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {ROWS.map((r) => (
          <div
            key={r.rank}
            className="flex items-center gap-3 rounded-md border border-transparent p-2 transition-colors hover:bg-muted/40"
          >
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold tabular-nums",
                RANK_TONE[r.rank] ?? "bg-muted text-muted-foreground",
              )}
            >
              {r.rank}
            </span>
            <UserAvatar name={r.name} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{r.name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {r.role}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-sm font-semibold tabular-nums">
                {r.score}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                score
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

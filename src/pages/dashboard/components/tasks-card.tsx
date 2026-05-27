import { useState } from "react"
import { ListChecks } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Priority = "high" | "medium" | "low"

interface Task {
  id: string
  title: string
  priority: Priority
  due: string
  done: boolean
}

const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Approve September payroll", priority: "high",   due: "Today",     done: false },
  { id: "2", title: "Review onboarding docs",    priority: "medium", due: "Tomorrow",  done: false },
  { id: "3", title: "Quarterly board meeting",   priority: "high",   due: "In 3 days", done: false },
  { id: "4", title: "Update vendor list",        priority: "low",    due: "This week", done: true },
  { id: "5", title: "Send Eid bonus memo",       priority: "medium", due: "Next Mon",  done: false },
]

const PRIORITY_TONE: Record<Priority, string> = {
  high:   "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  low:    "bg-slate-500/15 text-slate-700 dark:text-slate-400",
}

export function TasksCard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const toggle = (id: string) =>
    setTasks((t) =>
      t.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    )
  const remaining = tasks.filter((t) => !t.done).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="size-4 text-primary" /> My Tasks
            </CardTitle>
            <CardDescription>{remaining} pending</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((t) => (
          <label
            key={t.id}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-md border border-transparent p-2 transition-colors hover:bg-muted/40",
              t.done && "opacity-60",
            )}
          >
            <Checkbox checked={t.done} onCheckedChange={() => toggle(t.id)} />
            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  "truncate text-sm font-medium",
                  t.done && "line-through",
                )}
              >
                {t.title}
              </div>
              <div className="text-[11px] text-muted-foreground">
                Due {t.due}
              </div>
            </div>
            <Badge
              variant="secondary"
              className={cn("capitalize", PRIORITY_TONE[t.priority])}
            >
              {t.priority}
            </Badge>
          </label>
        ))}
      </CardContent>
    </Card>
  )
}

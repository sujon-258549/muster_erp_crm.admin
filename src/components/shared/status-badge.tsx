import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusTone =
  | "active"
  | "inactive"
  | "blocked"
  | "deleted"
  | "pending"
  | "success"
  | "warning"
  | "info"

interface StatusBadgeProps {
  tone: StatusTone
  label?: string
  className?: string
}

const TONE_LABELS: Record<StatusTone, string> = {
  active: "Active",
  inactive: "Deactive",
  blocked: "Blocked",
  deleted: "Deleted",
  pending: "Pending",
  success: "Success",
  warning: "Warning",
  info: "Info",
}

const TONE_CLASS: Record<StatusTone, string> = {
  active: "bg-emerald-600 text-white hover:bg-emerald-600/90",
  inactive: "bg-muted text-muted-foreground hover:bg-muted",
  blocked: "bg-destructive text-white hover:bg-destructive/90",
  deleted: "bg-zinc-500 text-white hover:bg-zinc-500/90",
  pending: "bg-amber-500 text-white hover:bg-amber-500/90",
  success: "bg-emerald-600 text-white hover:bg-emerald-600/90",
  warning: "bg-amber-500 text-white hover:bg-amber-500/90",
  info: "bg-sky-500 text-white hover:bg-sky-500/90",
}

// Tiny single-purpose badge so every "Active / Blocked / Pending" pill
// looks the same across the app.
export function StatusBadge({ tone, label, className }: StatusBadgeProps) {
  return (
    <Badge className={cn(TONE_CLASS[tone], className)}>
      {label ?? TONE_LABELS[tone]}
    </Badge>
  )
}

// Picks the right tone for a user/employee row based on flags.
export function pickEmployeeTone(flags: {
  isBlocked?: boolean
  isDeleted?: boolean
  isActive?: boolean
}): StatusTone {
  if (flags.isBlocked) return "blocked"
  if (flags.isDeleted) return "deleted"
  return flags.isActive ? "active" : "inactive"
}

import { formatDate, type DateFormat } from "@/lib/format"
import { cn } from "@/lib/utils"

interface FormatDateProps {
  value: Date | string | number | null | undefined
  format?: DateFormat
  fallback?: string
  className?: string
  // When set, hovering the rendered date shows the ISO string as a title.
  withTooltip?: boolean
}

// Always prefer this over inline `new Date(x).toLocaleString()` so dates
// render identically across the app.
export function FormatDate({
  value,
  format = "short",
  fallback = "—",
  className,
  withTooltip = true,
}: FormatDateProps) {
  const label = formatDate(value, format, fallback)
  const iso =
    value instanceof Date
      ? value.toISOString()
      : typeof value === "string" || typeof value === "number"
        ? new Date(value).toISOString()
        : undefined

  return (
    <time
      dateTime={iso}
      title={withTooltip ? iso : undefined}
      className={cn("tabular-nums", className)}
    >
      {label}
    </time>
  )
}

// Centralised formatters so dates, numbers and IDs render identically
// everywhere. Pages should call these helpers (or use the shared <FormatDate />
// component) instead of inlining `new Date().toLocaleString()` snippets.

export type DateFormat = "short" | "medium" | "long" | "datetime" | "relative" | "time"

const SHORT = new Intl.DateTimeFormat(undefined, {
  day: "2-digit",
  month: "short",
  year: "numeric",
})
const MEDIUM = new Intl.DateTimeFormat(undefined, {
  day: "2-digit",
  month: "long",
  year: "numeric",
})
const LONG = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
})
const DATETIME = new Intl.DateTimeFormat(undefined, {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})
const TIME = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
})
const RELATIVE = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

const RELATIVE_UNITS: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: "year", ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: "month", ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: "week", ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: "day", ms: 24 * 60 * 60 * 1000 },
  { unit: "hour", ms: 60 * 60 * 1000 },
  { unit: "minute", ms: 60 * 1000 },
]

function toDate(value: Date | string | number | null | undefined): Date | null {
  if (value == null || value === "") return null
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatDate(
  value: Date | string | number | null | undefined,
  format: DateFormat = "short",
  fallback = "—",
): string {
  const d = toDate(value)
  if (!d) return fallback

  switch (format) {
    case "medium":
      return MEDIUM.format(d)
    case "long":
      return LONG.format(d)
    case "datetime":
      return DATETIME.format(d)
    case "time":
      return TIME.format(d)
    case "relative": {
      const diff = d.getTime() - Date.now()
      const abs = Math.abs(diff)
      for (const { unit, ms } of RELATIVE_UNITS) {
        if (abs >= ms) return RELATIVE.format(Math.round(diff / ms), unit)
      }
      return RELATIVE.format(Math.round(diff / 1000), "second")
    }
    default:
      return SHORT.format(d)
  }
}

// Returns "SA" from "Sujon Ahmed", "JD" from "John Doe", "S" from "Sujon".
export function initialsFromName(name: string | null | undefined): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  const first = parts[0]!.charAt(0)
  const last = parts.length > 1 ? parts[parts.length - 1]!.charAt(0) : ""
  return (first + last).toUpperCase()
}

// Truncated id rendered in tables. `8f1c2a30...` etc.
export function shortId(id: string | null | undefined, len = 8): string {
  if (!id) return "—"
  return id.length > len ? `${id.slice(0, len)}…` : id
}

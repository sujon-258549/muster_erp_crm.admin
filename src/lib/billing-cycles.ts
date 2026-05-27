// Shared billing-cycle catalog used by Subscriptions and Plans.
//
// Each option's value is a stable, parseable string like "3-day", "2-week",
// "6-month", "5-year", or the literal "lifetime". The label is what we show
// in the UI. The helpers below derive end-date / months-covered from a
// value without needing a hardcoded switch per cycle.

export interface BillingCycleOption {
  value: string
  label: string
  group: "Trial" | "Weekly" | "Monthly" | "Yearly" | "Long-term" | "Other"
}

function pluralizeUnit(n: number, unit: string) {
  return n === 1 ? `1 ${unit}` : `${n} ${unit}s`
}

const buildOptions = (): BillingCycleOption[] => {
  const items: BillingCycleOption[] = []

  // Trial windows
  for (const d of [3, 7, 14, 30]) {
    items.push({
      value: `${d}-day`,
      label: pluralizeUnit(d, "Day"),
      group: "Trial",
    })
  }

  // Weekly
  for (const w of [1, 2, 3]) {
    items.push({
      value: `${w}-week`,
      label: pluralizeUnit(w, "Week"),
      group: "Weekly",
    })
  }

  // Monthly — 1 to 24 months
  for (let m = 1; m <= 24; m++) {
    items.push({
      value: `${m}-month`,
      label: pluralizeUnit(m, "Month"),
      group: "Monthly",
    })
  }

  // Yearly — 3 to 15 years (1 and 2 years already covered by 12, 24 months
  // above, but we keep "1 Year" / "2 Years" as explicit, friendlier labels)
  for (const y of [1, 2]) {
    items.push({
      value: `${y}-year`,
      label: pluralizeUnit(y, "Year"),
      group: "Yearly",
    })
  }
  for (let y = 3; y <= 15; y++) {
    items.push({
      value: `${y}-year`,
      label: pluralizeUnit(y, "Year"),
      group: "Yearly",
    })
  }

  // Long-term anchors
  for (const y of [20, 25, 30, 50, 100]) {
    items.push({
      value: `${y}-year`,
      label: pluralizeUnit(y, "Year"),
      group: "Long-term",
    })
  }

  items.push({
    value: "lifetime",
    label: "Lifetime (no expiry)",
    group: "Other",
  })

  return items
}

export const BILLING_CYCLE_OPTIONS: BillingCycleOption[] = buildOptions()

// {1 month, 2 weeks, 3 day, 1 year}-style parse. Returns null for
// "lifetime" or anything we can't decode.
function parseCycle(
  cycle: string,
): { unit: "day" | "week" | "month" | "year"; n: number } | null {
  if (!cycle || cycle === "lifetime") return null
  const m = cycle.match(/^(\d+)-(day|week|month|year)$/i)
  if (!m) return null
  return { n: Number(m[1]), unit: m[2].toLowerCase() as "day" | "week" | "month" | "year" }
}

// Add the cycle's duration to a start date and return the ISO date (yyyy-
// mm-dd) of the end. Lifetime / unknown returns "".
export function addCycleToDate(startIso: string, cycle: string): string {
  const parsed = parseCycle(cycle)
  if (!parsed) return ""
  const d = new Date(startIso)
  if (Number.isNaN(d.getTime())) return ""
  if (parsed.unit === "day") d.setDate(d.getDate() + parsed.n)
  else if (parsed.unit === "week") d.setDate(d.getDate() + parsed.n * 7)
  else if (parsed.unit === "month") d.setMonth(d.getMonth() + parsed.n)
  else d.setFullYear(d.getFullYear() + parsed.n)
  return d.toISOString().slice(0, 10)
}

// Friendly display label for a cycle value. Falls back to a lightly
// formatted version of the raw value when it isn't in the catalog —
// useful for legacy rows that still have "monthly" / "yearly".
export function getCycleLabel(cycle: string | null | undefined): string {
  if (!cycle) return "—"
  const known = BILLING_CYCLE_OPTIONS.find((o) => o.value === cycle)
  if (known) return known.label
  // Legacy / unknown — make it readable.
  return cycle.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

// Convert a cycle to a number of months for backend storage on plans.
// Lifetime → null. Sub-month cycles round up to 1.
export function cycleToMonths(cycle: string): number | null {
  const parsed = parseCycle(cycle)
  if (!parsed) return null
  if (parsed.unit === "day") return Math.max(1, Math.round(parsed.n / 30))
  if (parsed.unit === "week") return Math.max(1, Math.round(parsed.n / 4))
  if (parsed.unit === "month") return parsed.n
  return parsed.n * 12
}

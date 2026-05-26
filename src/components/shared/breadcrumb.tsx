import { Fragment } from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Crumb {
  label: string
  // `to` is undefined for the current (last) page — rendered as plain text.
  to?: string
}

// Friendly labels for known URL segments. Anything not in this map falls
// back to a Title-Cased version of the segment (e.g. "work-types" →
// "Work Types"). Add new entries here when you ship a new module.
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  employees: "Employees",
  new: "Create",
  departments: "Departments",
  roles: "Roles",
  designations: "Designations",
  permissions: "Permissions",
  customers: "Customers",
  products: "Products",
  inventory: "Inventory",
  invoices: "Invoices",
  settings: "Settings",
  users: "Users",
}

function prettyCase(seg: string): string {
  return seg
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function buildCrumbs(pathname: string): Crumb[] {
  // Dashboard is always the root crumb so users know how to get home.
  const crumbs: Crumb[] = [{ label: "Dashboard", to: "/dashboard" }]

  const segments = pathname.split("/").filter(Boolean)
  // Skip "dashboard" itself — it's already the root crumb.
  const meaningful =
    segments[0] === "dashboard" ? segments.slice(1) : segments

  let path = ""
  meaningful.forEach((seg, i) => {
    path += `/${seg}`
    const label = SEGMENT_LABELS[seg] ?? prettyCase(seg)
    crumbs.push({
      label,
      // Last segment is the current page — no link.
      to: i === meaningful.length - 1 ? undefined : path,
    })
  })

  // Mark the root as current when we're already on /dashboard.
  if (meaningful.length === 0) {
    crumbs[0] = { label: "Dashboard" }
  }

  return crumbs
}

interface BreadcrumbProps {
  className?: string
}

// Auto-generated breadcrumb. Reads the current location and builds a trail
// from the URL segments. Text-only — no icons, just labels separated by
// chevrons. Embedded inside <PageHeader /> by default.
export function Breadcrumb({ className }: BreadcrumbProps) {
  const { pathname } = useLocation()
  const crumbs = buildCrumbs(pathname)

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1
        const isFirst = i === 0
        return (
          <Fragment key={`${c.label}-${i}`}>
            {!isFirst && (
              <ChevronRight className="size-3 shrink-0 text-muted-foreground/60" />
            )}
            {c.to && !isLast ? (
              // Links sit at the same foreground color as the current page
              // so the breadcrumb reads at one consistent shade. Hover just
              // adds an underline for affordance, no color shift.
              <Link to={c.to} className="text-foreground hover:underline">
                {c.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className="font-medium text-foreground"
              >
                {c.label}
              </span>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}

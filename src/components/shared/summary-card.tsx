import { useId } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Colorful KPI card with a soft top-left → bottom-right gradient background
// and a decorative sparkline along the bottom. Drop several side-by-side for
// the dashboard KPI strip:
//
//   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//     <SummaryCard title="Properties" value="26,873" trend="03% This Week" tone="violet" />
//     <SummaryCard title="Cities"     value="26,873" trend="03% This Week" tone="rose"   />
//     ...
//   </div>

const summaryCardVariants = cva(
  // h-24 (96px) keeps the card compact so 4-up KPI strips don't dominate
  // the page. Bump to h-28/h-32 only if you need to fit longer captions.
  //
  // `ring-inset` is used instead of `border` because it paints on the
  // INSIDE edge of the rounded corner — a real border on a rounded +
  // gradient background produces uneven corner artifacts as the radius
  // clips through both layers. The ring color is intentionally very soft
  // (white/10) so the edge whispers, not shouts.
  //
  // `group` lets the sparkline below react to hover — only the area-fill
  // deepens, the edge stays put.
  "group relative flex h-24 flex-col justify-between overflow-hidden rounded-md p-4 text-white shadow-xs ring-1 ring-inset ring-white/10",
  {
    variants: {
      tone: {
        // `from-X-400 to-X-600` gives a soft, dimensional gradient — lighter
        // shade catches the light in the top-left, deeper shade grounds the
        // bottom-right where the sparkline sits.
        violet: "bg-gradient-to-br from-violet-400 to-violet-600",
        rose: "bg-gradient-to-br from-rose-400 to-rose-600",
        teal: "bg-gradient-to-br from-teal-400 to-teal-600",
        sky: "bg-gradient-to-br from-sky-400 to-sky-600",
        emerald: "bg-gradient-to-br from-emerald-400 to-emerald-600",
        amber: "bg-gradient-to-br from-amber-400 to-amber-600",
        indigo: "bg-gradient-to-br from-indigo-400 to-indigo-600",
        fuchsia: "bg-gradient-to-br from-fuchsia-400 to-fuchsia-600",
        slate: "bg-gradient-to-br from-slate-500 to-slate-700",
      },
    },
    defaultVariants: {
      tone: "violet",
    },
  },
)

export type SummaryCardTone = NonNullable<
  VariantProps<typeof summaryCardVariants>["tone"]
>

interface SummaryCardProps {
  title: string
  value: string | number
  // Small caption line under the value, e.g. "03% This Week".
  trend?: string
  tone?: SummaryCardTone
  // Optional sparkline data. Numbers are normalized into the card height;
  // when omitted a decorative default wave is rendered.
  data?: number[]
  className?: string
  // When provided, the card becomes a button — used for drill-down modals.
  onClick?: () => void
}

// Default decorative path — gentle wave with a peak near the right, mimics
// a healthy trend line. Used when the caller doesn't pass real data.
const DEFAULT_DATA = [10, 14, 11, 16, 12, 18, 15, 22, 19, 24]

// Build a SMOOTH SVG path from a series of points using a Catmull-Rom-style
// cardinal spline rendered as cubic Bezier curves. Each segment p[i] → p[i+1]
// gets two control points derived from the surrounding neighbors, so the
// curve glides through every point with no kinks at the joins.
//
// Returns the line path (just the curve) and the area path (curve closed
// down to the bottom edges for the gradient fill).
function buildPaths(values: number[], width: number, height: number) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const step = width / (values.length - 1)

  const points = values.map((v, i) => {
    const x = i * step
    // Flip Y (SVG y grows downward) and pad so the line never sits on the
    // top or bottom edge.
    const y = height - ((v - min) / range) * (height - 6) - 3
    return { x, y }
  })

  // Tension controls how "tight" the curve is. 1 = standard cardinal spline,
  // lower = looser/flatter, higher = wigglier. 0.9 looks the most natural.
  const tension = 0.9
  const fmt = (n: number) => n.toFixed(2)

  let line = `M ${fmt(points[0]!.x)} ${fmt(points[0]!.y)}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!
    const p1 = points[i]!
    const p2 = points[i + 1]!
    const p3 = points[i + 2] ?? p2

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension

    line += ` C ${fmt(cp1x)} ${fmt(cp1y)} ${fmt(cp2x)} ${fmt(cp2y)} ${fmt(p2.x)} ${fmt(p2.y)}`
  }

  const area = `${line} L ${fmt(width)} ${fmt(height)} L 0 ${fmt(height)} Z`

  return { line, area }
}

export function SummaryCard({
  title,
  value,
  trend,
  tone = "violet",
  data,
  className,
  onClick,
}: SummaryCardProps) {
  // useId keeps each gradient id unique so multiple cards on the same page
  // don't share/override gradients.
  const gradientId = useId().replace(/:/g, "")
  const VIEW_W = 100
  const VIEW_H = 36
  const { line, area } = buildPaths(data ?? DEFAULT_DATA, VIEW_W, VIEW_H)

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={cn(
        summaryCardVariants({ tone }),
        onClick &&
          "cursor-pointer transition-transform hover:-translate-y-0.5 hover:ring-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
        className,
      )}
    >
      {/* Foreground content — sits above the sparkline thanks to z-10. */}
      <div className="relative z-10 space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/85">
          {title}
        </p>
        <p className="text-2xl font-semibold tabular-nums leading-none">
          {value}
        </p>
        {trend && (
          <p className="text-[11px] font-medium text-white/85">{trend}</p>
        )}
      </div>

      {/* Decorative sparkline along the bottom. At rest the area-fill below
          the line is barely visible; on hover the fill deepens (more opaque
          white wash) so the chart reads as "progressing" — the line itself
          stays the same width, only the area-below changes. */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-12 w-full"
      >
        <defs>
          <linearGradient id={`fill-${gradientId}`} x1="0" x2="0" y1="0" y2="1">
            {/* `stop-opacity` is a real CSS property on <stop>, so we can
                animate it via Tailwind arbitrary values. Tuned so the
                area-fill is visible enough to read as a soft glow below
                the line, but never competes with the title/value. */}
            <stop
              offset="0%"
              stopColor="white"
              className="transition-[stop-opacity] duration-300  [stop-opacity:0.58]"
            />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* The area below the line — barely visible at rest, gently
            deepens on hover. */}
        <path d={area} fill={`url(#fill-${gradientId})`} />

        {/* Light stroke on top. Kept faint and thin on purpose so the
            sparkline reads as decoration, not a chart. */}
        <path
          d={line}
          fill="none"
          stroke="white"
          strokeOpacity={0.32}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

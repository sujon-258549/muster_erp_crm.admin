import { SummaryCard, type SummaryCardTone } from "@/components/shared"

interface Kpi {
  title: string
  value: string | number
  trend?: string
  tone: SummaryCardTone
  data?: number[]
}

const KPIS: Kpi[] = [
  {
    title: "Total Revenue",
    value: "৳12,48,920",
    trend: "↑ 12.4% vs last month",
    tone: "violet",
    data: [10, 14, 11, 16, 12, 18, 22, 20, 24],
  },
  {
    title: "Active Customers",
    value: "1,284",
    trend: "↑ 4.1% this week",
    tone: "sky",
    data: [12, 13, 11, 15, 17, 18, 17, 20, 22],
  },
  {
    title: "Orders Today",
    value: "324",
    trend: "↑ 18 new",
    tone: "teal",
    data: [8, 11, 13, 10, 14, 16, 18, 17, 20],
  },
  {
    title: "Pending Invoices",
    value: "37",
    trend: "↓ 5 cleared",
    tone: "rose",
    data: [22, 19, 21, 17, 14, 12, 13, 11, 8],
  },
]

export function KpiCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {KPIS.map((k) => (
        <SummaryCard
          key={k.title}
          title={k.title}
          value={k.value}
          trend={k.trend}
          tone={k.tone}
          data={k.data}
        />
      ))}
    </div>
  )
}

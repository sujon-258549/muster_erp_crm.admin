import PageHeader from "@/components/common/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  { label: "Total Customers", value: "1,248" },
  { label: "Active Orders", value: "324" },
  { label: "Revenue (MTD)", value: "$48,920" },
  { label: "Pending Invoices", value: "37" },
]

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your business" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

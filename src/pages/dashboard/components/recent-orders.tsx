import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Status = "pending" | "shipped" | "delivered" | "cancelled"

interface Order {
  id: string
  customer: string
  amount: string
  status: Status
  date: string
}

const ORDERS: Order[] = [
  { id: "#ORD-8821", customer: "ABC Traders",     amount: "৳45,000", status: "delivered", date: "Today" },
  { id: "#ORD-8820", customer: "XYZ Ltd.",        amount: "৳12,500", status: "shipped",   date: "Today" },
  { id: "#ORD-8819", customer: "Rahim Enterprise", amount: "৳8,400",  status: "pending",   date: "Today" },
  { id: "#ORD-8818", customer: "MK Sons",         amount: "৳23,200", status: "shipped",   date: "Yesterday" },
  { id: "#ORD-8817", customer: "Hossain & Co.",   amount: "৳3,750",  status: "cancelled", date: "Yesterday" },
]

const STATUS_TONE: Record<Status, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  shipped: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  delivered: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest 5 orders across all channels.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/70 bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold">Order</th>
                <th className="px-4 py-2.5 text-left font-semibold">Customer</th>
                <th className="px-4 py-2.5 text-right font-semibold">Amount</th>
                <th className="px-4 py-2.5 text-center font-semibold">Status</th>
                <th className="px-4 py-2.5 text-right font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 whitespace-nowrap font-medium">{o.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{o.customer}</td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">{o.amount}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant="secondary"
                      className={cn("capitalize", STATUS_TONE[o.status])}
                    >
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

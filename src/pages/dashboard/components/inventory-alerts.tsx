import { AlertTriangle, Package } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Item {
  name: string
  sku: string
  stock: number
  threshold: number
}

const ITEMS: Item[] = [
  { name: "Wireless Headset", sku: "WH-1842", stock: 4,  threshold: 20 },
  { name: "Office Chair Pro", sku: "OC-2271", stock: 7,  threshold: 25 },
  { name: "Smart Watch X2",   sku: "SW-0512", stock: 12, threshold: 30 },
  { name: "Leather Wallet",   sku: "LW-9034", stock: 0,  threshold: 15 },
]

export function InventoryAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-amber-500" /> Inventory Alerts
        </CardTitle>
        <CardDescription>Items running low — restock soon.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {ITEMS.map((it) => {
          const pct = Math.min(100, (it.stock / it.threshold) * 100)
          const isOut = it.stock === 0
          return (
            <div
              key={it.sku}
              className="rounded-md border border-border/60 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-8 place-items-center rounded-md bg-amber-500/10 text-amber-600">
                  <Package className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{it.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    SKU {it.sku}
                  </div>
                </div>
                <div className="text-right text-sm font-semibold tabular-nums">
                  {it.stock}
                  <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                    / {it.threshold}
                  </span>
                </div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    isOut
                      ? "bg-rose-500"
                      : pct < 30
                        ? "bg-amber-500"
                        : "bg-emerald-500",
                  )}
                  style={{ width: `${isOut ? 100 : pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

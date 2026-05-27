import {
  DashboardHeader,
  DepartmentDonut,
  InventoryAlerts,
  KpiCards,
  QuickActions,
  RecentActivities,
  RecentOrders,
  RevenueChart,
  SatisfactionGauge,
  SystemStatus,
  TasksCard,
  TopEmployees,
  TopProducts,
  UpcomingEvents,
  WeeklySales,
} from "./components"

// Dashboard is a thin shell — each card is a self-contained component in
// ./components. Add or rearrange sections by editing the JSX below; the
// component files own their own data + styles.
export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <DashboardHeader />

      <KpiCards />

      {/* Row 1: revenue chart (wide) + satisfaction gauge */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <SatisfactionGauge />
      </div>

      {/* Row 2: weekly sales bar + department headcount donut */}
      <div className="grid gap-5 lg:grid-cols-2">
        <WeeklySales />
        <DepartmentDonut />
      </div>

      {/* Row 3: recent orders (wide) + tasks */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <TasksCard />
      </div>

      {/* Row 4: top products (wide) + recent activities */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TopProducts />
        </div>
        <RecentActivities />
      </div>

      {/* Row 5: top employees + upcoming events + quick actions */}
      <div className="grid gap-5 lg:grid-cols-3">
        <TopEmployees />
        <UpcomingEvents />
        <QuickActions />
      </div>

      {/* Row 6: inventory alerts + system status */}
      <div className="grid gap-5 lg:grid-cols-2">
        <InventoryAlerts />
        <SystemStatus />
      </div>
    </div>
  )
}

import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// 12-month revenue + orders. Dummy data; swap with API call in production.
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]
const revenue = [42, 55, 49, 62, 71, 68, 84, 89, 95, 102, 118, 126]
const orders = [120, 138, 132, 154, 178, 169, 201, 218, 232, 248, 274, 296]

const options: ApexOptions = {
  chart: {
    type: "area",
    toolbar: { show: false },
    fontFamily: "inherit",
    zoom: { enabled: false },
  },
  stroke: { curve: "smooth", width: 2 },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  },
  colors: ["#10b981", "#0ea5e9"],
  dataLabels: { enabled: false },
  grid: { borderColor: "rgba(0,0,0,0.08)", strokeDashArray: 4 },
  xaxis: {
    categories: months,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: "#6b7280", fontSize: "11px" } },
  },
  yaxis: { labels: { style: { colors: "#6b7280", fontSize: "11px" } } },
  legend: { position: "top", horizontalAlign: "right", fontSize: "12px" },
  tooltip: { theme: "light", shared: true },
}

const series = [
  { name: "Revenue (k৳)", data: revenue },
  { name: "Orders", data: orders },
]

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Monthly revenue + order volume for the last 12 months.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={300}
        />
      </CardContent>
    </Card>
  )
}

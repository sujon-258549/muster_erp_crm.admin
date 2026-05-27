import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const options: ApexOptions = {
  chart: {
    type: "bar",
    toolbar: { show: false },
    fontFamily: "inherit",
    stacked: false,
  },
  plotOptions: {
    bar: {
      columnWidth: "50%",
      borderRadius: 6,
      borderRadiusApplication: "end",
    },
  },
  colors: ["#10b981", "#94a3b8"],
  dataLabels: { enabled: false },
  grid: { borderColor: "rgba(0,0,0,0.08)", strokeDashArray: 4 },
  xaxis: {
    categories: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: "#6b7280", fontSize: "11px" } },
  },
  yaxis: { labels: { style: { colors: "#6b7280", fontSize: "11px" } } },
  legend: { position: "top", horizontalAlign: "right", fontSize: "12px" },
  tooltip: { theme: "light" },
}

const series = [
  { name: "This week", data: [44, 55, 57, 56, 61, 58, 63] },
  { name: "Last week", data: [35, 41, 36, 26, 45, 48, 52] },
]

export function WeeklySales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Sales</CardTitle>
        <CardDescription>
          Daily sales comparison vs. previous week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={280}
        />
      </CardContent>
    </Card>
  )
}

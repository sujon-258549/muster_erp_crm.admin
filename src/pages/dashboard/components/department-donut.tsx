import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const labels = [
  "Engineering",
  "Sales",
  "Operations",
  "Support",
  "Marketing",
  "Admin",
]
const series = [38, 22, 18, 14, 9, 6]

const options: ApexOptions = {
  chart: { type: "donut", fontFamily: "inherit" },
  labels,
  colors: ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ec4899", "#64748b"],
  legend: { position: "bottom", fontSize: "12px" },
  dataLabels: { enabled: false },
  stroke: { width: 2, colors: ["#ffffff"] },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Total",
            fontSize: "12px",
            color: "#6b7280",
          },
        },
      },
    },
  },
  tooltip: { theme: "light", y: { formatter: (v: number) => `${v} people` } },
}

export function DepartmentDonut() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Headcount by Department</CardTitle>
        <CardDescription>
          Distribution of active employees across departments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={300}
        />
      </CardContent>
    </Card>
  )
}

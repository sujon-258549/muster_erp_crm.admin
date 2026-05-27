import ReactApexChart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import { Smile } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const SCORE = 87

const options: ApexOptions = {
  chart: { type: "radialBar", fontFamily: "inherit" },
  plotOptions: {
    radialBar: {
      hollow: { size: "60%" },
      track: { background: "rgba(0,0,0,0.06)" },
      dataLabels: {
        name: { offsetY: -10, fontSize: "12px", color: "#6b7280" },
        value: {
          fontSize: "26px",
          fontWeight: 700,
          formatter: (v) => `${v}%`,
        },
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      shadeIntensity: 0.3,
      gradientToColors: ["#34d399"],
      stops: [0, 100],
    },
  },
  colors: ["#10b981"],
  stroke: { lineCap: "round" },
  labels: ["Score"],
}

export function SatisfactionGauge() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="size-4 text-emerald-500" /> Customer Satisfaction
        </CardTitle>
        <CardDescription>
          Average rating across the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReactApexChart
          options={options}
          series={[SCORE]}
          type="radialBar"
          height={240}
        />
        <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-md bg-emerald-500/10 p-2">
            <div className="text-sm font-semibold text-emerald-600">412</div>
            <div className="text-muted-foreground">Promoters</div>
          </div>
          <div className="rounded-md bg-amber-500/10 p-2">
            <div className="text-sm font-semibold text-amber-600">68</div>
            <div className="text-muted-foreground">Neutral</div>
          </div>
          <div className="rounded-md bg-rose-500/10 p-2">
            <div className="text-sm font-semibold text-rose-600">14</div>
            <div className="text-muted-foreground">Detractors</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

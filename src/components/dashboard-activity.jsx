import { createPortal } from "react-dom"
import { ArrowDownLeft, ChartNoAxesCombined, CircleAlert, Users } from "lucide-react"
import { periods } from "./dashboard-options"
import { PreviewMark } from "./preview-mark"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

const metrics = [
  { label: "درخواست‌ها", icon: ArrowDownLeft },
  { label: "نرخ موفقیت", icon: ChartNoAxesCombined },
  { label: "خطاها", icon: CircleAlert },
  { label: "نشست‌ها", icon: Users },
]

export default function ActivitySummary({ period, onPeriodChange, standalone, toolbarTarget }) {
  const controls = (
        <div role="group" aria-label="بازهٔ فعالیت" className="flex flex-wrap gap-2">
          {Object.entries(periods).map(([value, label]) => (
            <Button key={value} type="button" size="sm" variant={period === value ? "default" : "outline"}
              aria-pressed={period === value} onClick={() => onPeriodChange(value)}>{label}</Button>
          ))}
        </div>
  )
  return (
    <section className="grid gap-4" aria-labelledby={standalone ? "dashboard-title" : "activity-title"}>
      {standalone ? toolbarTarget && createPortal(controls, toolbarTarget) : <Card className="flex-row flex-wrap items-center justify-between gap-3 p-4 shadow-none">
        <h2 id="activity-title" className="text-lg font-bold">فعالیت سامانه <PreviewMark /></h2>
        {controls}
      </Card>}
      <div className="dashboard-metrics grid gap-3">
        {metrics.map(({ label, icon: Icon }) => (
          <Card key={label} className="gap-2 py-4 shadow-none">
            <CardHeader className="px-4">
              <CardDescription className="flex items-center gap-2">
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {label} <PreviewMark />
              </CardDescription>
              <CardTitle><span aria-label="داده در دسترس نیست">—</span></CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground" role="status">داده‌ای برای {periods[period]} در دسترس نیست.</p>
    </section>
  )
}


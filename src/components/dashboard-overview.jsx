import { lazy, Suspense } from "react"
import { Activity, CreditCard, DollarSign, Users } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { ContentSkeleton } from "./dashboard-skeleton"

const ActivitySummary = lazy(() => import("./dashboard-activity"))
const number = new Intl.NumberFormat("fa-IR")
const metrics = [
  ["درآمد کل", "۴۵٬۲۳۱٬۸۹۰ تومان", "۲۰٫۱٪ بیشتر از ماه گذشته", DollarSign],
  ["اشتراک‌ها", "۲٬۳۵۰", "۱۸۰٫۱٪ بیشتر از ماه گذشته", Users],
  ["فروش", "۱۲٬۲۳۴", "۱۹٪ بیشتر از ماه گذشته", CreditCard],
  ["کاربران فعال", "۵۷۳", "۲۰۱ نفر بیشتر از ساعت گذشته", Activity],
]
const months = ["فرو", "ارد", "خرد", "تیر", "مرد", "شهر", "مهر", "آبا", "آذر", "دی", "بهم", "اسف"]
const revenue = [1800, 3200, 2450, 5200, 3900, 2800, 4100, 1950, 4600, 3500, 2650, 4300]
const chartData = months.map((month, i) => ({ month, revenue: revenue[i] }))
const sales = [
  ["سارا احمدی", "sara", 1950000], ["علی رضایی", "ali", 390000],
  ["نگار مرادی", "negar", 299000], ["رضا کریمی", "reza", 990000], ["مینا نوری", "mina", 450000],
]

export function downloadOverview() {
  const rows = [["شاخص", "مقدار نمونه", "تغییر"], ...metrics.map(row => row.slice(0, 3))]
  const url = URL.createObjectURL(new Blob(["\uFEFF", rows.map(row => row.join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = "dashboard-preview.csv"
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function Overview({ preferences, period, onPeriodChange }) {
  return <Tabs defaultValue="overview" dir="rtl" className="min-w-0 gap-4">
    <TabsList aria-label="نمای داشبورد" className="overview-tabs max-w-full">
      <TabsTrigger value="overview">نمای کلی</TabsTrigger>
      <TabsTrigger value="analytics" disabled={!preferences.showActivity}>تحلیل‌ها</TabsTrigger>
      <TabsTrigger value="reports" disabled>گزارش‌ها</TabsTrigger>
      <TabsTrigger value="notifications" disabled>اعلان‌ها</TabsTrigger>
    </TabsList>
    <TabsContent value="overview" className="@container grid gap-4">
      <div className="grid gap-4 @min-[32rem]:grid-cols-2 @min-[56rem]:grid-cols-4">
        {metrics.map(([title, value, change, Icon]) => <Card key={title} className="gap-2">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{title}</CardTitle><Icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold tabular-nums">{value}</p><p className="text-xs text-muted-foreground">{change}</p></CardContent>
        </Card>)}
      </div>
      <div className={preferences.showData ? "grid gap-4 @min-[48rem]:grid-cols-[4fr_3fr]" : "grid gap-4"}>
        {preferences.showData && <Card className="min-w-0">
          <CardHeader><CardTitle>نمای کلی درآمد</CardTitle></CardHeader>
          <CardContent className="px-3">
            <ChartContainer dir="ltr" className="h-[320px] w-full" config={{ revenue: { label: "درآمد (هزار تومان)", color: "var(--color-primary)" } }}>
              <BarChart data={chartData} accessibilityLayer>
                {preferences.grid && <CartesianGrid vertical={false} strokeDasharray="2 5" opacity={0.3} />}
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis width={44} tickLine={false} axisLine={false} tickFormatter={value => number.format(value)} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>}
        <Card className="min-w-0"><CardHeader><CardTitle>فروش‌های اخیر</CardTitle><CardDescription>این ماه ۲۶۵ فروش ثبت شده است.</CardDescription></CardHeader>
          <CardContent><ul className="grid gap-7">{sales.map(([name, handle, amount]) => <li key={handle} className="flex items-center gap-3">
            <Avatar><AvatarFallback>{name.split(" ").map(part => part[0]).join("‌")}</AvatarFallback></Avatar>
            <div className="min-w-0 flex-1"><p className="text-sm font-medium">{name}</p><p dir="ltr" className="truncate text-start text-xs text-muted-foreground [text-align:right]">{handle}@example.com</p></div>
            <span className="text-sm font-semibold">{number.format(amount)} تومان</span>
          </li>)}</ul></CardContent>
        </Card>
      </div>
    </TabsContent>
    <TabsContent value="analytics"><Suspense fallback={<ContentSkeleton variant="activity" />}><ActivitySummary period={period} onPeriodChange={onPeriodChange} /></Suspense></TabsContent>
  </Tabs>
}

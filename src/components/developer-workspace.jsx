import { useState } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ContentSkeleton } from "./dashboard-skeleton"
import { Field, FieldLabel } from "./ui/field"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Empty, EmptyHeader, EmptyTitle } from "./ui/empty"
import { NativeSelect, NativeSelectOption } from "./ui/native-select"
import { Switch } from "./ui/switch"
import { previewModules } from "./dashboard-options"

const states = { ready: "آماده", loading: "در حال بارگیری", empty: "بدون داده", error: "خطا" }
const skeletons = { overview: "نمای کلی", activity: "فعالیت", settings: "تنظیمات", details: "جزئیات" }

export default function DeveloperWorkspace({ version, previewControls, onNavigate, showMarks, onShowMarksChange, themeMode, onThemeChange }) {
  const [state, setState] = useState("ready")
  const [skeleton, setSkeleton] = useState("activity")
  const [destination, setDestination] = useState(previewModules[0].id)
  const [copyStatus, setCopyStatus] = useState("")

  async function copyDiagnostics() {
    const report = {
      version, themeMode, environment: "development",
      viewport: { width: window.innerWidth, height: window.innerHeight },
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    }
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2))
      setCopyStatus("اطلاعات عیب‌یابی کپی شد.")
    } catch {
      setCopyStatus("مرورگر اجازهٔ کپی نداد.")
    }
  }
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader><CardTitle>ابزارهای پیش‌نمایش</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <Field orientation="horizontal" className="justify-between">
              <FieldLabel htmlFor="developer-marks">نشان‌های قرمز پیش‌نمایش</FieldLabel>
              <Switch id="developer-marks" dir="ltr" checked={showMarks} onCheckedChange={onShowMarksChange} />
            </Field>
            <Field orientation="horizontal" className="justify-between">
              <FieldLabel htmlFor="developer-theme">تم داشبورد</FieldLabel>
              <NativeSelect id="developer-theme" value={themeMode} onChange={event => onThemeChange(event.target.value)}>
                <NativeSelectOption value="system">طبق سیستم</NativeSelectOption>
                <NativeSelectOption value="light">روشن</NativeSelectOption>
                <NativeSelectOption value="dark">تیره</NativeSelectOption>
              </NativeSelect>
            </Field>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={() => onNavigate("settings")}>تنظیمات داشبورد</Button>
              {previewControls}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader><CardTitle>وضعیت محیط</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between gap-3"><dt>محیط اجرا</dt><dd><Badge variant="secondary">توسعه</Badge></dd></div>
              <div className="flex justify-between gap-3"><dt>نسخهٔ داشبورد</dt><dd><bdi>{version}</bdi></dd></div>
              <div className="flex justify-between gap-3"><dt>ماژول‌های نمونه</dt><dd>{previewModules.length.toLocaleString("fa-IR")}</dd></div>
            </dl>
            <Button variant="outline" className="w-fit" onClick={copyDiagnostics}>کپی اطلاعات عیب‌یابی</Button>
            <p role="status" className="text-sm text-muted-foreground">{copyStatus}</p>
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-none">
        <CardHeader><CardTitle>آزمایش وضعیت رابط</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="developer-state">وضعیت نمونه</FieldLabel>
              <NativeSelect id="developer-state" value={state} onChange={event => setState(event.target.value)}>
                {Object.entries(states).map(([id, title]) => <NativeSelectOption key={id} value={id}>{title}</NativeSelectOption>)}
              </NativeSelect>
            </Field>
            {state === "loading" && <Field>
              <FieldLabel htmlFor="developer-skeleton">چیدمان اسکلتون</FieldLabel>
              <NativeSelect id="developer-skeleton" value={skeleton} onChange={event => setSkeleton(event.target.value)}>
                {Object.entries(skeletons).map(([id, title]) => <NativeSelectOption key={id} value={id}>{title}</NativeSelectOption>)}
              </NativeSelect>
            </Field>}
          </div>
          {state === "loading" && <ContentSkeleton variant={skeleton} />}
          {state === "empty" && <Empty><EmptyHeader><EmptyTitle>داده‌ای برای نمایش وجود ندارد</EmptyTitle></EmptyHeader></Empty>}
          {state === "error" && <Alert variant="destructive"><AlertTitle>خطای نمونه</AlertTitle><AlertDescription>بارگیری داده‌ها ناموفق بود.</AlertDescription></Alert>}
          {state === "ready" && <Badge variant="secondary">داده آماده است</Badge>}
        </CardContent>
      </Card>
      <Card className="shadow-none">
        <CardHeader><CardTitle>دسترسی سریع به ماژول‌ها</CardTitle></CardHeader>
        <CardContent>
          <form className="flex flex-wrap items-end gap-3" onSubmit={event => { event.preventDefault(); onNavigate(destination) }}>
            <Field className="w-fit">
              <FieldLabel htmlFor="developer-module">ماژول نمونه</FieldLabel>
              <NativeSelect id="developer-module" value={destination} onChange={event => setDestination(event.target.value)}>
                {previewModules.map(module => <NativeSelectOption key={module.id} value={module.id}>{module.title}</NativeSelectOption>)}
              </NativeSelect>
            </Field>
            <Button type="submit" variant="outline">باز کردن ماژول</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>بازخورد و پیگیری</CardTitle>
          <CardDescription>گزارش‌ها و پیشنهادهای پروژه در گیت‌هاب پیگیری می‌شوند.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline"><a href="https://github.com/pejmansadrin/Dashboard/issues" target="_blank" rel="noreferrer">مشاهدهٔ بازخوردها</a></Button>
          <Button asChild variant="outline"><a href="https://github.com/pejmansadrin/Dashboard/issues/new" target="_blank" rel="noreferrer">ثبت بازخورد</a></Button>
        </CardContent>
      </Card>
    </div>
  )
}

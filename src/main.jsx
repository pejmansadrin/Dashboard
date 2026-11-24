import React, { useEffect, useState, useTransition } from "react"
import { createRoot } from "react-dom/client"
import { Eye, EyeOff, Moon, SlidersHorizontal, Sun } from "lucide-react"
import { Button } from "./components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog"
import { Alert, AlertDescription } from "./components/ui/alert"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { Field, FieldLabel } from "./components/ui/field"
import { Slider } from "./components/ui/slider"
import { DirectionProvider } from "./components/ui/direction"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./components/ui/input-group"
import { Separator } from "./components/ui/separator"
import { Spinner } from "./components/ui/spinner"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { version } from "../package.json"
import zilberLogo from "./assets/zilber.svg"
import "./app.css"

function applyTheme() {
  const dark = localStorage.getItem("theme") !== "light"
  document.documentElement.classList.toggle("dark", dark)
  return dark
}

const themeTokens = getComputedStyle(document.documentElement)
const styleDefaults = { spacing: 24, frameRadius: parseInt(themeTokens.getPropertyValue("--radius-2xl"), 10), color: "#ff7ee3", width: 900, formWidth: 400, gap: 20, cornerRadius: parseInt(themeTokens.getPropertyValue("--radius-md"), 10), panelHeight: 128, blur: 14, violet: "#5b2a86" }

function readStyles() {
  try {
    return { ...styleDefaults, ...JSON.parse(localStorage.getItem("login-styles")) }
  } catch {
    return styleDefaults
  }
}

function StyleControls({ styles, onChange }) {
  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="tweak-trigger h-10">
          <SlidersHorizontal aria-hidden="true" /> تنظیم ظاهر
        </Button>
      </DialogTrigger>
        <DialogContent className="tweak-dialog top-auto translate-none" showOverlay={false} showCloseButton={false} dir="rtl" aria-describedby={undefined}>
          <DialogTitle className="text-lg font-semibold">تنظیم ظاهر</DialogTitle>
          <div className="style-controls-fields">
            {[
              ["spacing", "فاصلهٔ داخلی پنل", 8, 40],
              ["frameRadius", "گردی قاب", 8, 40],
              ["width", "عرض قاب", 720, 1440],
              ["formWidth", "عرض فرم", 240, 480],
              ["gap", "فاصلهٔ فیلدها", 12, 40],
              ["cornerRadius", "گردی فیلدها و دکمه‌ها", 0, 24],
              ["panelHeight", "ارتفاع پنل در موبایل", 100, 260],
              ["blur", "محوشدگی گرادیان", 0, 40],
            ].map(([key, label, min, max]) => (
              <Field key={key} className="gap-2">
                <span>{label} <output>{styles[key]} px</output></span>
                <Slider min={min} max={max} value={[styles[key]]} thumbLabel={label}
                  onValueChange={([value]) => onChange({ ...styles, [key]: value })} />
              </Field>
            ))}
            {[["color", "رنگ درخشش پنل"], ["violet", "رنگ پایهٔ پنل"]].map(([key, label]) => (
              <Field key={key} orientation="horizontal" className="style-color">
                <Label htmlFor={key}>{label}</Label>
                <Input id={key} className="w-12 px-1" type="color" value={styles[key]}
                  onChange={event => onChange({ ...styles, [key]: event.target.value })} />
              </Field>
            ))}
            <Button type="button" variant="outline" size="sm" className="w-fit px-4" onClick={() => onChange(styleDefaults)}>بازنشانی</Button>
          </div>
          <DialogClose asChild>
            <Button type="button" variant="outline">بستن</Button>
          </DialogClose>
        </DialogContent>
    </Dialog>
  )
}

function Login() {
  const [styles, setStyles] = useState(import.meta.env.DEV ? readStyles : styleDefaults)
  const [dark, setDark] = useState(applyTheme)
  const [pending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const sync = () => setDark(applyTheme())
    window.addEventListener("storage", sync)
    return () => window.removeEventListener("storage", sync)
  }, [])

  function toggleTheme() {
    localStorage.setItem("theme", dark ? "light" : "dark")
    setDark(applyTheme())
  }

  return (
    <div className="login-page" style={{
      "--panel-spacing": styles.spacing + "px",
      "--frame-radius": styles.frameRadius + "px",
      "--color-orchid": styles.color,
      "--color-violet": styles.violet,
      "--frame-width": styles.width + "px",
      "--form-width": styles.formWidth + "px",
      "--form-gap": styles.gap + "px",
      "--radius-md": styles.cornerRadius + "px",
      "--mobile-panel-height": styles.panelHeight + "px",
      "--aurora-blur": styles.blur + "px",
    }}>
      <header className="login-toolbar" aria-label="تنظیمات نمایش">
        {import.meta.env.DEV && <StyleControls styles={styles} onChange={next => {
          setStyles(next)
          localStorage.setItem("login-styles", JSON.stringify(next))
        }} />}
      </header>
      <main className="login-layout">
        <div className="night-art" aria-hidden="true"><div className="aurora" /></div>
        <div className="night-panel">
          <div className="product-brand" dir="rtl">
            <div className="flex items-center gap-2">
              <img src={zilberLogo} width="80" height="80" alt="" />
              <h2 className="text-4xl font-bold">زیلبر</h2>
            </div>
            <p className="font-semibold">راهکار جامع فناوری اطلاعات و ارتباطات</p>
            <p className="text-sm leading-7 text-white/80">نرم‌افزار سازمانی، زیرساخت شبکه، امنیت سایبری و داده برای سازمان‌ها و صنایع، از طراحی تا اجرا و پشتیبانی.</p>
          </div>
        </div>
        <Card className="login-pane gap-0 py-0 shadow-none" dir="rtl" role="region" aria-labelledby="login-title">
          <CardContent className="login-content px-0">
            <CardHeader className="relative -top-2 mb-8 gap-3 px-0">
              <CardTitle><h1 id="login-title" className="text-center text-2xl leading-8 font-bold">ورود به داشبورد</h1></CardTitle>
              <Separator className="bg-foreground/12" />
            </CardHeader>
            <form className="login-form" aria-busy={pending} onChange={() => setSubmitted(false)} onSubmit={event => {
              event.preventDefault()
              startTransition(() => setSubmitted(true))
            }}>
              <Field className="gap-2">
                <FieldLabel className="text-[13px] font-medium" htmlFor="email">ایمیل</FieldLabel>
                <Input id="email" className="login-input text-sm text-left" type="email" dir="ltr" placeholder="name@example.com" autoComplete="username" required />
              </Field>
              <Field className="gap-2">
                <FieldLabel className="text-[13px] font-medium" htmlFor="password">رمز عبور</FieldLabel>
                <InputGroup dir="ltr" className="login-input h-10">
                  <InputGroupInput id="password" className="text-sm text-left" type={visible ? "text" : "password"} placeholder="password" autoComplete="current-password" required />
                  <InputGroupAddon align="inline-end" className="py-0 pr-3">
                    <InputGroupButton size="icon-sm" className="rounded-md"
                      aria-label={visible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"} onClick={() => setVisible(!visible)}>
                      {visible ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Separator className="bg-foreground/12" />
              <div className="grid gap-2">
                <Button type="submit" className="login-submit mt-1 h-10 w-full justify-center gap-2 text-sm font-semibold" disabled={pending}>ورود{pending ? <Spinner className="motion-reduce:animate-none" aria-hidden="true" /> : null}</Button>
                <div className="flex flex-wrap items-center justify-center gap-x-2 text-xs">
                  <span className="text-muted-foreground">رمز عبور خود را فراموش کرده‌اید؟</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type="button" variant="link" size="sm" className="h-auto px-0 py-1 text-xs underline underline-offset-4">فراموشی رمز عبور</Button>
                    </DialogTrigger>
                    <DialogContent dir="rtl" className="text-right [&>button]:right-auto [&>button]:left-4">
                      <DialogHeader className="pe-8 text-right sm:text-right">
                        <DialogTitle>بازیابی رمز عبور</DialogTitle>
                        <DialogDescription>بازیابی آنلاین هنوز فعال نیست. برای بازنشانی رمز عبور، با مدیر سامانه تماس بگیرید.</DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              {submitted && <Alert variant="destructive" className="login-feedback border-0 bg-transparent p-0"><AlertDescription>سرویس ورود هنوز متصل نشده است.</AlertDescription></Alert>}
            </form>
          </CardContent>
          <CardFooter className="login-footer px-0" dir="rtl">
            <p>نسخهٔ نرم‌افزار <bdi dir="ltr">{version}</bdi></p>
            <Button type="button" variant="ghost" size="icon-sm" className="theme-switch"
              aria-label={dark ? "فعال کردن حالت روشن" : "فعال کردن حالت تیره"} onClick={toggleTheme}>
              {dark ? <Sun /> : <Moon />}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

createRoot(document.getElementById("root")).render(<DirectionProvider dir="rtl"><Login /></DirectionProvider>)

import { PreviewMark } from "./components/preview-mark"
import React, { lazy, Suspense, useEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { Eye, EyeOff, Moon, SlidersHorizontal, Sun } from "lucide-react"
import { DashboardSkeleton } from "./components/dashboard-skeleton"
import { Button } from "./components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog"
import { FormFeedback } from "./components/form-feedback"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { Field, FieldLabel } from "./components/ui/field"
import { Slider } from "./components/ui/slider"
import { DirectionProvider } from "./components/ui/direction"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./components/ui/input-group"
import { NativeSelect, NativeSelectOption } from "./components/ui/native-select"
import { Separator } from "./components/ui/separator"
import { Spinner } from "./components/ui/spinner"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { version } from "../package.json"
import zilberLogo from "./assets/zilber.svg"
import "./app.css"

const DashboardHome = lazy(() => import("./components/dashboard-home").then(module => ({ default: module.DashboardHome })))

function applyTheme() {
  const stored = localStorage.getItem("theme")
  const mode = stored === "system" || stored === "light" ? stored : "dark"
  const dark = mode === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches : mode === "dark"
  document.documentElement.classList.toggle("dark", dark)
  return { dark, mode }
}

const loginTransitionDelay = 450
const companyName = import.meta.env.VITE_COMPANY_NAME?.trim()
const themeTokens = getComputedStyle(document.documentElement)
const styleDefaults = { spacing: 24, frameRadius: parseInt(themeTokens.getPropertyValue("--radius-xl"), 10), color: "#ff7ee3", width: parseInt(themeTokens.getPropertyValue("--spacing-frame-width"), 10), formWidth: 400, gap: 20, cornerRadius: parseInt(themeTokens.getPropertyValue("--spacing-login-control"), 10) / 4, panelHeight: 128, blur: 14, violet: "#5b2a86" }

function readStyles() {
  try {
    const saved = JSON.parse(localStorage.getItem("login-styles")) ?? {}
    if (!saved.geometryVersion) {
      if (saved.frameRadius === 40) delete saved.frameRadius
      if (saved.cornerRadius === 20) delete saved.cornerRadius
    }
    return { ...styleDefaults, ...saved }
  } catch {
    return styleDefaults
  }
}

function StyleControls({ styles, onChange, scenario, onScenarioChange, onPreviewSubmit, onSwitchPage, compact }) {
  const isLogin = Boolean(onPreviewSubmit)
  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button type="button" variant={compact ? "ghost" : "outline"} size={compact ? "icon-sm" : "default"}
          aria-label="تنظیم ظاهر و تعاملات" title={compact ? "تنظیم ظاهر و تعاملات" : undefined}
          className={compact ? undefined : "tweak-trigger h-10"}>
          <SlidersHorizontal aria-hidden="true" />{!compact && "تنظیم ظاهر و تعاملات"}
        </Button>
      </DialogTrigger>
      <DialogContent className="tweak-dialog top-auto translate-none" showOverlay={false} showCloseButton={false} dir="rtl" aria-describedby={undefined}>
        <DialogTitle className="text-lg font-semibold">{isLogin ? "تنظیم ظاهر و تعاملات" : "تعاملات داشبورد"}</DialogTitle>
        {isLogin && (<>
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
          <Field className="gap-2">
            <FieldLabel htmlFor="login-scenario">شبیه‌سازی نتیجهٔ ورود <PreviewMark /></FieldLabel>
            <NativeSelect id="login-scenario" value={scenario} onChange={event => onScenarioChange(event.target.value)}>
              <NativeSelectOption value="default">رفتار فعلی</NativeSelectOption>
              <NativeSelectOption value="wrong-password">رمز عبور اشتباه</NativeSelectOption>
              <NativeSelectOption value="success">ورود موفق</NativeSelectOption>
              <NativeSelectOption value="loading">در انتظار پاسخ</NativeSelectOption>
              <NativeSelectOption value="network-error">خطای ارتباط با سرور</NativeSelectOption>
            </NativeSelect>
          </Field>
          </>)}
        <div className="flex flex-wrap gap-2">
          {isLogin && <DialogClose asChild>
            <Button type="button" onClick={onPreviewSubmit}>اجرای ورود آزمایشی</Button>
          </DialogClose>}
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onSwitchPage}>
              {isLogin ? "پیش‌نمایش داشبورد" : "بازگشت به فرم ورود"}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="ghost">بستن</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ThemeSwitch({ dark, onToggle }) {
  return (
    <Button type="button" variant="ghost" size="icon-sm" className="theme-switch"
      aria-label={dark ? "فعال کردن حالت روشن" : "فعال کردن حالت تیره"} onClick={onToggle}>
      {dark ? <Sun /> : <Moon />}
    </Button>
  )
}

function DashboardApp() {
  const formRef = useRef(null)
  const headingRef = useRef(null)
  const screen = window.location.pathname === "/workspace" ? "dashboard" : "login"
  const isDashboard = import.meta.env.DEV && screen === "dashboard"
  const [styles, setStyles] = useState(import.meta.env.DEV ? readStyles : styleDefaults)
  const [{ dark, mode: themeMode }, setAppearance] = useState(applyTheme)
  const [scenario, setScenario] = useState(import.meta.env.DEV ? "success" : "default")
  const [loginStatus, setLoginStatus] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const completingLogin = import.meta.env.DEV && showResult && loginStatus === "success"
  const pending = completingLogin || (showResult && loginStatus === "loading")
  const invalidPassword = showResult && loginStatus === "wrong-password"
  const feedback = loginStatus === "default" ? "سرویس ورود هنوز متصل نشده است." : import.meta.env.DEV ? {
    "wrong-password": "رمز عبور اشتباه است.",
    "network-error": "ارتباط با سرور برقرار نشد. دوباره تلاش کنید.",
  }[loginStatus] : null
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const sync = () => setAppearance(applyTheme())
    window.addEventListener("storage", sync)
    media.addEventListener("change", sync)
    return () => {
      window.removeEventListener("storage", sync)
      media.removeEventListener("change", sync)
    }
  }, [])

  useEffect(() => {
    if (!completingLogin) return

    const timer = window.setTimeout(() => {
      setShowResult(false)
      setVisible(false)
      window.location.assign("/dashboard/")
    }, loginTransitionDelay)

    return () => window.clearTimeout(timer)
  }, [completingLogin])

  function changeTheme(mode) {
    localStorage.setItem("theme", mode)
    setAppearance(applyTheme())
  }

  function toggleTheme() {
    changeTheme(dark ? "light" : "dark")
  }

  function switchPreview() {
    setShowResult(false)
    setVisible(false)
    window.location.assign(isDashboard ? "/" : "/dashboard/")
  }

  function runPreviewLogin() {
    const form = formRef.current
    if (!form) return

    const email = form.elements.namedItem("email")
    const password = form.elements.namedItem("password")
    if (!email.value) email.value = "preview@example.com"
    if (!password.value) password.value = "preview-password"
    form.requestSubmit()
  }

  const previewControls = import.meta.env.DEV ? (
    <StyleControls compact={isDashboard} styles={styles} scenario={scenario} onPreviewSubmit={isDashboard ? undefined : runPreviewLogin}
      onSwitchPage={switchPreview} onScenarioChange={next => {
      setScenario(next)
      setShowResult(false)
        }} onChange={next => {
      setStyles(next)
      localStorage.setItem("login-styles", JSON.stringify({ ...next, geometryVersion: 2 }))
        }} />
  ) : null

  const frameStyle = {
    "--panel-spacing": styles.spacing + "px",
    "--frame-radius": styles.frameRadius + "px",
    "--color-orchid": styles.color,
    "--color-violet": styles.violet,
    "--frame-width": styles.width + "px",
    "--form-width": styles.formWidth + "px",
    "--form-gap": styles.gap + "px",
    "--login-control-radius": styles.cornerRadius + "px",
    "--radius-md": styles.cornerRadius === styleDefaults.cornerRadius ? undefined : styles.cornerRadius + "px",
    "--mobile-panel-height": styles.panelHeight + "px",
    "--aurora-blur": styles.blur + "px",
  }

  return (
    <div className={isDashboard ? "dashboard-preview" : "login-page"} style={frameStyle}>
      {!isDashboard && <header className="login-toolbar" aria-label="تنظیمات نمایش">{previewControls}</header>}
      {isDashboard ? (
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardHome companyName={companyName} version={version} onExit={switchPreview} headingRef={headingRef} previewControls={previewControls}
            dark={dark} onToggleTheme={toggleTheme} themeMode={themeMode} onThemeChange={changeTheme} />
        </Suspense>
      ) : (
        <main className="login-layout">
          <div className="night-art" aria-hidden="true"><div className="aurora" /></div>
          <div className="night-panel">
            <div className="product-brand" dir="rtl">
              <Button asChild variant="link" className="h-auto gap-2 px-0 py-0 text-inherit underline-offset-4 focus-visible:ring-white/50">
                <a href="https://www.zilber.tech/">
                  <img src={zilberLogo} width="64" height="64" className="size-14 shrink-0 md:size-16" alt="" />
                  <h2 className="text-[32px] leading-none font-extrabold md:text-[40px]">زیلبر</h2>
                </a>
              </Button>
              <div className="grid gap-2">
                <p className="text-base leading-7 font-semibold text-balance">راهکار جامع فناوری اطلاعات و ارتباطات</p>
                <p className="text-sm leading-7 text-pretty text-white/85">نرم‌افزار سازمانی، زیرساخت شبکه، امنیت سایبری و داده برای سازمان‌ها و صنایع، از طراحی تا اجرا و پشتیبانی.</p>
              </div>
            </div>
          </div>
          <Card className="login-pane gap-0 py-0 shadow-none" dir="rtl" role="region" aria-labelledby="login-title">
            <CardContent className="login-content px-0">
              <CardHeader className="relative -top-2 mb-8 gap-3 px-0">
                <CardTitle><h1 ref={headingRef} id="login-title" tabIndex={-1} className="text-center text-2xl leading-8 font-bold outline-none">ورود به داشبورد{companyName && <> <bdi dir="auto">{companyName}</bdi></>} <PreviewMark /></h1></CardTitle>
                <Separator className="bg-divider" />
              </CardHeader>
              <form ref={formRef} className="login-form" aria-busy={pending} onChange={() => { if (!completingLogin) setShowResult(false) }} onSubmit={event => {
                event.preventDefault()
                if (pending) return
                setLoginStatus(import.meta.env.DEV ? scenario : "default")
                setShowResult(true)
              }}>
                <Field className="gap-2">
                  <FieldLabel className="text-[13px] font-medium" htmlFor="email">ایمیل</FieldLabel>
                  <Input id="email" className="login-input text-sm text-left" type="email" dir="ltr" placeholder="name@example.com" autoComplete="username" required />
                </Field>
                <Field className="gap-2">
                  <FieldLabel className="text-[13px] font-medium" htmlFor="password">رمز عبور</FieldLabel>
                  <InputGroup dir="ltr" className="login-input h-10">
                    <InputGroupInput id="password" aria-invalid={invalidPassword || undefined} aria-describedby={invalidPassword ? "login-feedback" : undefined} className="text-sm text-left" type={visible ? "text" : "password"} placeholder="password" autoComplete="current-password" required />
                    <InputGroupAddon align="inline-end" className="py-0 pr-3">
                      <InputGroupButton size="icon-sm" className="rounded-md"
                        aria-label={visible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"} onClick={() => setVisible(!visible)}>
                        {visible ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <Separator className="bg-divider" />
                <div className="grid gap-2">
                  <Button type="submit" formNoValidate={import.meta.env.DEV && scenario === "success"} className="login-submit mt-1 h-10 w-full justify-center gap-2 text-sm font-semibold" disabled={pending}>{pending ? "در حال ورود…" : "ورود"}{pending ? <Spinner className="motion-reduce:animate-none" aria-hidden="true" /> : null}</Button>
                  <div className="flex flex-wrap items-center justify-center gap-x-2 text-xs">
                    <span className="text-muted-foreground">رمز عبور خود را فراموش کرده‌اید؟</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button type="button" variant="link" size="sm" className="h-auto px-0 py-1 text-xs underline underline-offset-4">فراموشی رمز عبور <PreviewMark /></Button>
                      </DialogTrigger>
                      <DialogContent dir="rtl" className="rounded-logo text-right [&>button]:right-auto [&>button]:left-4">
                        <DialogHeader className="pe-8 text-right sm:text-right">
                          <DialogTitle>بازیابی رمز عبور <PreviewMark /></DialogTitle>
                          <DialogDescription>بازیابی آنلاین هنوز فعال نیست. برای بازنشانی رمز عبور، با مدیر سامانه تماس بگیرید.</DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <FormFeedback id="login-feedback" open={showResult}>
                  {feedback}
                </FormFeedback>
              </form>
            </CardContent>
            <CardFooter className="login-footer px-0" dir="rtl">
              <p>نسخهٔ نرم‌افزار <bdi dir="ltr">{version}</bdi></p>
              <ThemeSwitch dark={dark} onToggle={toggleTheme} />
            </CardFooter>
          </Card>
        </main>
      )}
    </div>
  )
}

createRoot(document.getElementById("root")).render(<DirectionProvider dir="rtl"><DashboardApp /></DirectionProvider>)

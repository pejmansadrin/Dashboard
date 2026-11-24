import React, { useEffect, useState, useTransition } from "react"
import { createRoot } from "react-dom/client"
import { ArrowLeft, Eye, EyeOff, LoaderCircle, Moon, PanelsTopLeft, SlidersHorizontal, Sun } from "lucide-react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import "./app.css"

function applyTheme() {
  const dark = localStorage.getItem("theme") !== "light"
  document.documentElement.classList.toggle("dark", dark)
  return dark
}

const styleDefaults = { spacing: 24, radius: 24, color: "#ff7ee3", width: 1008, formWidth: 368, gap: 20, controlRadius: 8, panelHeight: 128, blur: 14, violet: "#5b2a86" }

function readStyles() {
  try {
    return { ...styleDefaults, ...JSON.parse(localStorage.getItem("login-styles")) }
  } catch {
    return styleDefaults
  }
}

function StyleControls({ styles, onChange }) {
  return (
    <details className="style-controls">
      <summary><SlidersHorizontal size={16} aria-hidden="true" /><span>تنظیم ظاهر</span></summary>
      <div className="style-controls-fields">
        {[
          ["spacing", "فاصلهٔ پنل", 8, 40],
          ["radius", "گردی قاب", 8, 40],
          ["width", "عرض قاب", 720, 1440],
          ["formWidth", "عرض فرم", 240, 480],
          ["gap", "فاصلهٔ فیلدها", 12, 40],
          ["controlRadius", "گردی فیلدها و دکمه‌ها", 0, 24],
          ["panelHeight", "ارتفاع پنل در موبایل", 100, 260],
          ["blur", "محوشدگی گرادیان", 0, 40],
        ].map(([key, label, min, max]) => (
          <label key={key}>
            {label} <output>{styles[key]} px</output>
            <input type="range" min={min} max={max} value={styles[key]}
              onChange={event => onChange({ ...styles, [key]: event.target.valueAsNumber })} />
          </label>
        ))}
        {[["color", "رنگ درخشش پنل"], ["violet", "رنگ پایهٔ پنل"]].map(([key, label]) => (
          <label key={key} className="style-color">
            {label}
            <input type="color" value={styles[key]}
              onChange={event => onChange({ ...styles, [key]: event.target.value })} />
          </label>
        ))}
        <Button type="button" variant="outline" size="sm" className="w-fit px-4" onClick={() => onChange(styleDefaults)}>بازنشانی</Button>
      </div>
    </details>
  )
}

function Login() {
  const [styles, setStyles] = useState(readStyles)
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
      "--frame-radius": styles.radius + "px",
      "--color-orchid": styles.color,
      "--color-violet": styles.violet,
      "--frame-width": styles.width + "px",
      "--form-width": styles.formWidth + "px",
      "--form-gap": styles.gap + "px",
      "--radius-md": styles.controlRadius + "px",
      "--mobile-panel-height": styles.panelHeight + "px",
      "--aurora-blur": styles.blur + "px",
    }}>
      <header className="login-toolbar" aria-label="تنظیمات نمایش">
        <StyleControls styles={styles} onChange={next => {
          setStyles(next)
          localStorage.setItem("login-styles", JSON.stringify(next))
        }} />
        <Button type="button" variant="outline" size="icon" className="theme-switch"
          aria-label={dark ? "فعال کردن حالت روشن" : "فعال کردن حالت تیره"} onClick={toggleTheme}>
          {dark ? <Sun /> : <Moon />}
        </Button>
      </header>
      <main className="login-layout">
        <div className="night-panel" aria-hidden="true">
          <div className="night-art"><div className="aurora" /></div>
          <span className="dashboard-mark"><PanelsTopLeft size={24} /></span>
        </div>
        <section className="login-pane" dir="rtl" aria-labelledby="login-title">
          <div className="login-content">
            <header className="mb-8">

              <h1 id="login-title" className="text-2xl leading-8 font-semibold">ورود به داشبورد</h1>
            </header>
            <form className="login-form" aria-busy={pending} onChange={() => setSubmitted(false)} onSubmit={event => {
              event.preventDefault()
              startTransition(() => setSubmitted(true))
            }}>
              <div className="grid gap-2">
                <Label htmlFor="email">ایمیل</Label>
                <Input id="email" className="login-input text-left" type="email" dir="ltr" placeholder="name@example.com" autoComplete="username" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">رمز عبور</Label>
                <div className="relative">
                  <Input id="password" className="login-input pl-12" type={visible ? "text" : "password"} dir="rtl" placeholder="رمز عبور خود را وارد کنید" autoComplete="current-password" required />
                  <Button type="button" variant="ghost" size="icon" className="absolute left-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={visible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"} onClick={() => setVisible(!visible)}>
                    {visible ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="login-submit mt-1 h-12 w-36 max-w-full justify-self-start justify-center gap-2 font-semibold" disabled={pending}>ورود{pending ? <LoaderCircle className="motion-safe:animate-spin" aria-hidden="true" /> : <ArrowLeft aria-hidden="true" />}</Button>
              {submitted && <p role="status" className="login-feedback">سرویس ورود هنوز متصل نشده است.</p>}
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

createRoot(document.getElementById("root")).render(<Login />)

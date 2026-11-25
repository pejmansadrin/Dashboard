import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import {
  Activity, ArrowDownLeft, Building2, ChartNoAxesCombined, CircleAlert, Database, Globe2,
  LayoutDashboard, Lightbulb, LogOut, Moon, Network, PanelLeft, PanelRight, TriangleAlert,
  Palette, Plug, Search, Server, Settings2, Sun, UserRound, Users, X,
} from "lucide-react"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty"
import { Field, FieldDescription, FieldLabel } from "./ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "./ui/item"
import { Sidebar, SidebarContent, SidebarFooter, SidebarProvider } from "./ui/sidebar"
import { NativeSelect, NativeSelectOption } from "./ui/native-select"
import { Separator } from "./ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet"
import { Switch } from "./ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import zilberLogo from "../assets/zilber.svg"

const sections = [
  { id: "overview", title: "نمای کلی", icon: LayoutDashboard },
  { id: "activity", title: "فعالیت", icon: Activity },
  { id: "connections", title: "اتصال‌ها", icon: Network },
  { id: "settings", title: "تنظیمات", icon: Settings2 },
]

const periods = {
  "60m": "۶۰ دقیقهٔ اخیر",
  "24h": "۲۴ ساعت اخیر",
  "7d": "۷ روز اخیر",
}

const metrics = [
  { label: "درخواست‌ها", icon: ArrowDownLeft },
  { label: "نرخ موفقیت", icon: ChartNoAxesCombined },
  { label: "خطاها", icon: CircleAlert },
  { label: "نشست‌ها", icon: Users },
]

function ActivitySummary({ period, onPeriodChange }) {
  return (
    <section className="grid gap-4" aria-labelledby="activity-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="activity-title" className="text-lg font-bold">فعالیت سامانه</h2>
        <NativeSelect aria-label="بازهٔ فعالیت" value={period} onChange={event => onPeriodChange(event.target.value)}>
          {Object.entries(periods).map(([value, label]) => (
            <NativeSelectOption key={value} value={value}>{label}</NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="dashboard-metrics grid gap-3">
        {metrics.map(({ label, icon: Icon }) => (
          <Card key={label} className="gap-2 py-4 shadow-none">
            <CardHeader className="px-4">
              <CardDescription className="flex items-center gap-2">
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {label}
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

function Connections() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>اتصال‌های سازمان</CardTitle>
      </CardHeader>
      <CardContent>
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Plug aria-hidden="true" /></EmptyMedia>
            <EmptyTitle>منبع داده متصل نیست</EmptyTitle>
            <EmptyDescription>پس از اتصال منبع دادهٔ سازمان، اطلاعات آن در این بخش نمایش داده می‌شود.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}

const wideViewportQuery = "(min-width: 70rem)"

function subscribeToWideViewport(onChange) {
  const viewport = window.matchMedia(wideViewportQuery)
  viewport.addEventListener("change", onChange)
  return () => viewport.removeEventListener("change", onChange)
}

function getWideViewport() {
  return window.matchMedia(wideViewportQuery).matches
}

function IconAction({ label, side = "bottom", children, ...props }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={label} {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side} dir="rtl">{label}</TooltipContent>
    </Tooltip>
  )
}

function animateFrameLight(node) {
  if (!node) return

  function chooseArc() {
    const start = Math.random() * 360
    const travel = (45 + Math.random() * 90) * (Math.random() < 0.5 ? -1 : 1)
    node.style.setProperty("--frame-start", start + "deg")
    node.style.setProperty("--frame-end", (start + travel) + "deg")
  }

  function onCycle(event) {
    if (event.target === node && event.animationName === "frame-light-orbit") chooseArc()
  }

  chooseArc()
  node.addEventListener("animationiteration", onCycle)
  return () => node.removeEventListener("animationiteration", onCycle)
}

function ProfileMenu({ workspaceName, version, themeMode, onThemeChange, onExit }) {
  const [timezone, setTimezone] = useState(() => localStorage.getItem("dashboard-timezone") || "auto")
  const resolvedTimezone = timezone === "auto" ? Intl.DateTimeFormat().resolvedOptions().timeZone : timezone
  function changeTimezone(value) {
    setTimezone(value)
    localStorage.setItem("dashboard-timezone", value)
  }
  return (
    <DropdownMenu dir="rtl">
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="پروفایل کاربر" className="size-9 rounded-full p-0">
              <Avatar className="size-7">
                <AvatarFallback className="bg-accent text-accent-foreground"><UserRound className="size-4" aria-hidden="true" /></AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent dir="rtl">پروفایل کاربر</TooltipContent>
      </Tooltip>
      <DropdownMenuContent ref={animateFrameLight} dir="rtl" align="end" sideOffset={8} className="dashboard-popup-menu profile-menu neon-frame">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger><UserRound aria-hidden="true" /> حساب کاربری</DropdownMenuSubTrigger>
          <DropdownMenuSubContent ref={animateFrameLight} dir="rtl" className="profile-menu neon-frame w-56">
            <DropdownMenuLabel className="grid gap-1">
              <span>کاربر آزمایشی</span>
              <bdi dir="auto" className="text-xs font-normal text-muted-foreground">{workspaceName}</bdi>
              <span className="text-xs font-normal text-muted-foreground">نسخهٔ نرم‌افزار <bdi dir="ltr">{version}</bdi></span>
            </DropdownMenuLabel>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">تم</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={themeMode} onValueChange={onThemeChange}>
          <DropdownMenuRadioItem value="system">طبق سیستم</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">تیره</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">روشن</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Globe2 aria-hidden="true" />
            <span className="grid gap-0.5">منطقهٔ زمانی
              <span className="text-xs text-muted-foreground">
                {timezone === "auto" && "خودکار · "}<bdi dir="ltr">{resolvedTimezone}</bdi>
              </span>
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent ref={animateFrameLight} dir="rtl" className="profile-menu neon-frame w-48">
            <DropdownMenuRadioGroup value={timezone} onValueChange={changeTimezone}>
              <DropdownMenuRadioItem value="auto">خودکار</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Asia/Tehran">تهران</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="UTC"><bdi dir="ltr">UTC</bdi></DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onExit}>
          <LogOut className="rotate-180" aria-hidden="true" /> خروج از پیش‌نمایش
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SidebarModeMenu({ mode, onModeChange }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" className="dashboard-nav-item"
          data-sidebar-control aria-label="کنترل سایدبار">
          <PanelRight aria-hidden="true" />
          <span>کنترل سایدبار</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent ref={animateFrameLight} dir="rtl" align="start" side="top" sideOffset={8} className="dashboard-popup-menu neon-frame">
        <DropdownMenuLabel>کنترل سایدبار</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={mode} onValueChange={onModeChange}>
          <DropdownMenuRadioItem value="expanded">باز</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="collapsed">جمع‌شده</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="hover">باز شدن با هاور</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const dashboardPalettes = {
  tokyo: "توکیو نایت",
  azure: "آبی",
  mint: "نعنایی",
  amber: "کهربایی",
}

const dashboardDefaults = { palette: "tokyo", compact: false, reduceMotion: false, openDetails: true, defaultPeriod: "60m" }

function readDashboardPreferences() {
  try {
    return { ...dashboardDefaults, ...JSON.parse(localStorage.getItem("dashboard-preferences")) }
  } catch {
    return dashboardDefaults
  }
}

function SettingToggle({ id, title, description, checked, onCheckedChange }) {
  return (
    <Field orientation="horizontal" className="settings-row gap-4">
      <div className="grid flex-1 gap-1">
        <FieldLabel htmlFor={id}>{title}</FieldLabel>
        <FieldDescription id={id + "-description"}>{description}</FieldDescription>
      </div>
      <Switch id={id} aria-describedby={id + "-description"} dir="ltr" className="data-[size=default]:h-5" checked={checked} onCheckedChange={onCheckedChange} />
    </Field>
  )
}

function SettingSelect({ id, title, description, value, onChange, options }) {
  return (
    <Field orientation="horizontal" className="settings-row gap-4">
      <div className="grid flex-1 gap-1">
        <FieldLabel htmlFor={id}>{title}</FieldLabel>
        <FieldDescription id={id + "-description"}>{description}</FieldDescription>
      </div>
      <NativeSelect id={id} aria-describedby={id + "-description"} value={value} onChange={event => onChange(event.target.value)}>
        {Object.entries(options).map(([key, label]) => (
          <NativeSelectOption key={key} value={key}>{label}</NativeSelectOption>
        ))}
      </NativeSelect>
    </Field>
  )
}

const settingsSections = [
  { id: "appearance", title: "ظاهر و حرکت", icon: Palette, keywords: "تم رنگ پالت روشن تیره سیستم انیمیشن کاهش حرکت", description: "تم، رنگ داشبورد و حرکت‌های رابط کاربری" },
  { id: "layout", title: "چیدمان و ناوبری", icon: LayoutDashboard, keywords: "سایدبار منو جزئیات فضای کار فشرده هاور", description: "حالت سایدبار و نحوهٔ نمایش فضای کار" },
  { id: "activity", title: "فعالیت", icon: Activity, keywords: "بازه پیش فرض زمان ساعت روز آمار", description: "بازهٔ زمانی نمایش فعالیت سامانه" },
]

function SettingsGroup({ title, children }) {
  return (
    <section className="grid gap-3">
      <h3 className="text-base font-semibold">{title}</h3>
      <Card className="gap-0 py-0 shadow-none">{children}</Card>
    </section>
  )
}

function DashboardSettings({ preferences, onPreferenceChange, sidebarMode, onSidebarChange, onReset, themeMode, onThemeChange, headingRef }) {
  const [section, setSection] = useState("appearance")
  const [query, setQuery] = useState("")
  const search = query.trim().replaceAll("‌", " ")
  const matches = settingsSections.filter(item => `${item.title} ${item.keywords}`.includes(search))
  const active = matches.find(item => item.id === section) ?? matches[0]

  return (
    <Tabs value={active?.id ?? ""} onValueChange={setSection} orientation="vertical" className="settings-workspace">
      <aside className="settings-navigation" aria-label="دسته‌های تنظیمات">
        <header className="settings-nav-heading">
          <h1 ref={headingRef} id="dashboard-title" tabIndex={-1} className="text-base font-semibold outline-none">تنظیمات داشبورد</h1>
        </header>
        <InputGroup dir="rtl" className="h-(--dashboard-nav-size)">
          <InputGroupInput dir="rtl" type="search" value={query} onChange={event => setQuery(event.target.value)}
            className="h-full py-0 text-start placeholder:text-start" placeholder="جست‌وجوی تنظیمات" aria-label="جست‌وجوی تنظیمات" />
          <InputGroupAddon align="inline-end" className="pl-3 pr-0"><Search aria-hidden="true" /></InputGroupAddon>
        </InputGroup>
        <TabsList variant="line" aria-label="دسته‌های تنظیمات" className="settings-tabs">
          {settingsSections.map((item, index) => {
            const visible = matches.includes(item)
            const Icon = item.icon
            return (
              <div key={item.id} className="settings-result" data-visible={visible}
                inert={!visible} style={{ "--result-delay": index * 24 + "ms" }}>
                <TabsTrigger value={item.id} disabled={!visible} className="settings-tab" aria-label={item.title}>
                  <Icon aria-hidden="true" /><span className="module-nav-label">{item.title}</span>
                </TabsTrigger>
              </div>
            )
          })}
        </TabsList>
      </aside>

      <div className="settings-main">
        {active ? (
          <header className="dashboard-page-heading">
            <h2>{active.title}</h2>
            <p className="text-sm text-muted-foreground">{active.description}</p>
          </header>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><Search aria-hidden="true" /></EmptyMedia>
              <EmptyTitle>تنظیمی پیدا نشد</EmptyTitle>
              <EmptyDescription>عبارت دیگری جست‌وجو کنید.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        <TabsContent value="appearance" className="settings-panel">
          <SettingsGroup title="رنگ و نمایش">
            <SettingSelect id="dashboard-theme" title="تم" description="روشن، تیره یا هماهنگ با سیستم"
              value={themeMode} onChange={onThemeChange} options={{ system: "طبق سیستم", dark: "تیره", light: "روشن" }} />
            <Separator className="bg-divider" />
            <SettingSelect id="dashboard-palette" title="پالت رنگ داشبورد" description="رنگ عناصر برجستهٔ داشبورد"
              value={preferences.palette} onChange={value => onPreferenceChange("palette", value)} options={dashboardPalettes} />
          </SettingsGroup>
          <SettingsGroup title="حرکت">
            <SettingToggle id="dashboard-motion" title="کاهش حرکت" description="انیمیشن منوها، پنل‌ها و تغییر نماها غیرفعال شود."
              checked={preferences.reduceMotion} onCheckedChange={value => onPreferenceChange("reduceMotion", value)} />
          </SettingsGroup>
        </TabsContent>
        <TabsContent value="layout" className="settings-panel">
          <SettingsGroup title="ناوبری">
            <SettingSelect id="dashboard-sidebar-mode" title="حالت سایدبار" description="رفتار باز و بسته شدن نوار ناوبری"
              value={sidebarMode} onChange={onSidebarChange} options={{ expanded: "باز", collapsed: "جمع‌شده", hover: "باز شدن با هاور" }} />
          </SettingsGroup>
          <SettingsGroup title="فضای کار">
            <SettingToggle id="dashboard-density" title="نمای فشرده" description="فاصلهٔ کارت‌ها و حاشیهٔ محتوای داشبورد کمتر شود."
              checked={preferences.compact} onCheckedChange={value => onPreferenceChange("compact", value)} />
            <Separator className="bg-divider" />
            <SettingToggle id="dashboard-open-details" title="نمایش جزئیات هنگام ورود" description="پنل جزئیات به‌طور پیش‌فرض در دسکتاپ باز باشد."
              checked={preferences.openDetails} onCheckedChange={value => onPreferenceChange("openDetails", value)} />
          </SettingsGroup>
        </TabsContent>
        <TabsContent value="activity" className="settings-panel">
          <SettingsGroup title="گزارش فعالیت">
            <SettingSelect id="dashboard-default-period" title="بازهٔ پیش‌فرض فعالیت" description="بازهٔ زمانی اولیه برای کارت‌های فعالیت"
              value={preferences.defaultPeriod} onChange={value => onPreferenceChange("defaultPeriod", value)} options={periods} />
          </SettingsGroup>
        </TabsContent>
        <footer className="settings-shell-footer">
          <p className="text-xs text-muted-foreground">ترجیحات نمایش در همین مرورگر ذخیره می‌شوند.</p>
          <Button type="button" variant="outline" size="sm" onClick={onReset}>بازنشانی تنظیمات</Button>
        </footer>
      </div>
    </Tabs>
  )
}

function FeedbackMenu() {
  const options = [
    { title: "گزارش مشکل", hint: "در استفاده از داشبورد", icon: TriangleAlert, color: "text-orange-500" },
    { title: "پیشنهاد", hint: "برای بهبود داشبورد", icon: Lightbulb, color: "text-amber-500" },
  ]
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm">بازخورد</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={6} collisionPadding={12} className="feedback-menu p-3">
        <DropdownMenuLabel className="mb-2">چه بازخوردی دارید؟</DropdownMenuLabel>
        <div className="grid grid-cols-2 gap-2">
          {options.map(({ title, hint, icon: Icon, color }) => (
            <DropdownMenuItem key={title} asChild className="flex min-h-28 flex-col justify-center gap-1 rounded-md border bg-muted/40 text-center focus:border-ring">
              <a href={`https://github.com/pejmansadrin/Dashboard/issues/new?title=${encodeURIComponent(title + " — ")}`}
                target="_blank" rel="noopener noreferrer" aria-label={title + " در گیت‌هاب"}>
                <Icon aria-hidden="true" className={`mb-1 size-6 ${color}`} />
                <span className="font-semibold">{title}</span>
                <span className="text-xs text-muted-foreground">{hint}</span>
              </a>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DashboardSearch({ onChoose }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="dashboard-search-trigger" aria-label="جست‌وجوی داشبورد">
          <Search aria-hidden="true" />
          <span>جست‌وجوی داشبورد</span>
        </Button>
      </DialogTrigger>
      <DialogContent ref={animateFrameLight} dir="rtl" className="dashboard-search-dialog neon-frame gap-0 p-0" showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>جست‌وجوی داشبورد</DialogTitle>
          <DialogDescription>بخش‌های داشبورد را جست‌وجو و باز کنید.</DialogDescription>
        </DialogHeader>
        <Command dir="rtl">
          <CommandInput placeholder="نام بخش را بنویسید…" aria-label="جست‌وجوی بخش‌ها" />
          <CommandList className="[&>[cmdk-list-sizer]]:p-2">
            <CommandEmpty>بخشی پیدا نشد.</CommandEmpty>
            <CommandGroup heading="بخش‌های داشبورد">
              {sections.map(({ id, title, icon: Icon }) => (
                <CommandItem key={id} value={id} keywords={[title]} onSelect={() => {
                  setOpen(false)
                  onChoose(id)
                }}>
                  <Icon aria-hidden="true" /> {title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function WorkspaceDetails({ version, onViewConnections }) {
  return (
    <div className="grid content-start gap-4 p-4 text-right text-sm">
      <dl className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="text-muted-foreground">حالت اجرا</dt>
          <dd><Badge variant="secondary">پیش‌نمایش</Badge></dd>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="text-muted-foreground">نسخهٔ نرم‌افزار</dt>
          <dd><bdi dir="ltr">{version}</bdi></dd>
        </div>
      </dl>
      <Separator className="bg-divider" />
      <Empty className="border border-dashed px-3 py-6 md:p-6">
        <EmptyHeader>
          <EmptyMedia variant="icon"><Database aria-hidden="true" /></EmptyMedia>
          <EmptyTitle className="text-sm">منبع داده متصل نیست</EmptyTitle>
          <EmptyDescription className="text-xs">شاخص‌ها پس از اتصال منبع داده در دسترس قرار می‌گیرند.</EmptyDescription>
        </EmptyHeader>
      </Empty>
      <Button type="button" variant="outline" size="sm" onClick={onViewConnections}>
        <Network aria-hidden="true" /> مشاهدهٔ اتصال‌ها
      </Button>
    </div>
  )
}

export function DashboardHome({ companyName, version, onExit, headingRef, dark, onToggleTheme, previewControls, themeMode, onThemeChange }) {
  const [section, setSection] = useState("overview")
  const [overPrimaryOption, setOverPrimaryOption] = useState(false)
  const [preferences, setPreferences] = useState(readDashboardPreferences)
  const [period, setPeriod] = useState(preferences.defaultPeriod)
  const [sidebarPreference, setSidebarPreference] = useState(() => {
    const saved = localStorage.getItem("dashboard-sidebar-mode")
    if (["expanded", "collapsed", "hover"].includes(saved)) return saved

    const previous = localStorage.getItem("dashboard-nav-expanded")
    return previous === "true" ? "expanded" : previous === "false" ? "hover" : null
  })
  const [showDetails, setShowDetails] = useState(preferences.openDetails)
  const [mobileDetails, setMobileDetails] = useState(false)
  const wide = useSyncExternalStore(subscribeToWideViewport, getWideViewport)
  const sidebarMode = sidebarPreference ?? (wide ? "expanded" : "collapsed")
  const detailsTrigger = useRef(null)
  const mainRef = useRef(null)
  const workspaceName = companyName || "داشبورد سازمانی"
  const sectionTitle = sections.find(item => item.id === section).title
  const showingSettings = section === "settings"
  const detailsOpen = !showingSettings && (wide ? showDetails : mobileDetails)

  useEffect(() => {
    if (wide) setMobileDetails(false)
  }, [wide])

  function changeSection(nextSection) {
    setOverPrimaryOption(false)
    setSection(nextSection)
    mainRef.current?.scrollTo({ top: 0 })
  }

  function changeSidebarMode(mode) {
    setSidebarPreference(mode)
    localStorage.setItem("dashboard-sidebar-mode", mode)
  }

  function changePreference(key, value) {
    const next = { ...preferences, [key]: value }
    setPreferences(next)
    localStorage.setItem("dashboard-preferences", JSON.stringify(next))

    if (key === "openDetails") setShowDetails(value)
    if (key === "defaultPeriod") setPeriod(value)
  }

  function resetPreferences() {
    setPreferences(dashboardDefaults)
    localStorage.removeItem("dashboard-preferences")
    localStorage.removeItem("dashboard-sidebar-mode")
    localStorage.removeItem("dashboard-nav-expanded")
    setSidebarPreference(null)
    setShowDetails(dashboardDefaults.openDetails)
    setPeriod(dashboardDefaults.defaultPeriod)
  }

  function toggleDetails() {
    if (wide) setShowDetails(!showDetails)
    else setMobileDetails(!mobileDetails)
  }

  function closeDesktopDetails() {
    setShowDetails(false)
    detailsTrigger.current?.focus()
  }

  function viewConnections() {
    changeSection("connections")
    setMobileDetails(false)
  }

  return (
    <TooltipProvider delayDuration={250}>
      <div dir="rtl" className="dashboard-shell" data-palette={preferences.palette} data-compact={preferences.compact} data-reduce-motion={preferences.reduceMotion}>
        <header className="dashboard-header">
          <Breadcrumb>
            <BreadcrumbList className="gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink href="https://www.zilber.tech/" className="flex items-center gap-2 font-semibold text-foreground">
                  <img src={zilberLogo} width="24" height="24" alt="" />
                  زیلبر
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="rotate-180" />
              <BreadcrumbItem className="font-semibold text-foreground"><bdi dir="auto">{workspaceName}</bdi></BreadcrumbItem>
              <BreadcrumbSeparator className="rotate-180" />
              <BreadcrumbItem><BreadcrumbPage>{sectionTitle}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="dashboard-header-actions">
            <FeedbackMenu />
            <DashboardSearch onChoose={changeSection} />
            {previewControls}
            <IconAction label={dark ? "فعال کردن حالت روشن" : "فعال کردن حالت تیره"} onClick={onToggleTheme}>
              {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </IconAction>
            {!showingSettings && <IconAction label={detailsOpen ? "بستن جزئیات محیط" : "باز کردن جزئیات محیط"}
              ref={detailsTrigger} aria-expanded={detailsOpen}
              aria-controls={wide || detailsOpen ? "dashboard-details" : undefined} onClick={toggleDetails}>
              <PanelLeft aria-hidden="true" />
            </IconAction>}
            <Separator orientation="vertical" className="h-5 bg-divider" />
            <ProfileMenu workspaceName={workspaceName} version={version} themeMode={themeMode} onThemeChange={onThemeChange} onExit={onExit} />
          </div>
        </header>

        <SidebarProvider className="contents" open={sidebarMode === "expanded"}
          onOpenChange={open => changeSidebarMode(open ? "expanded" : "collapsed")}>
          <Tabs value={section} onValueChange={changeSection} activationMode="manual" orientation="vertical" className="dashboard-workspace"
            data-sidebar-mode={sidebarMode} data-details={wide && detailsOpen}
            data-context-nav={showingSettings}
            data-primary-active={overPrimaryOption}>
            <Sidebar side="right" collapsible="none" id="dashboard-navigation" role="navigation" aria-label="ناوبری داشبورد" dir="rtl" className="dashboard-rail"
              onPointerLeave={() => setOverPrimaryOption(false)}>
              <SidebarContent className="w-full overflow-clip">
                <TabsList aria-label="بخش‌های داشبورد" className="dashboard-rail-list">
                  {sections.map(({ id, title, icon: Icon }) => (
                    <Tooltip key={id}>
                      <TooltipTrigger asChild>
                        <TabsTrigger value={id} className={id === "settings" ? "dashboard-nav-item dashboard-settings-link" : "dashboard-nav-item"} aria-label={id === "settings" ? "تنظیمات داشبورد" : title}
                          onPointerEnter={event => {
                            if (showingSettings && wide && event.pointerType === "mouse") setOverPrimaryOption(true)
                          }}>
                          <Icon aria-hidden="true" />
                          <span>{title}</span>
                        </TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="left" dir="rtl">{title}</TooltipContent>
                    </Tooltip>
                  ))}
                </TabsList>
              </SidebarContent>
              <SidebarFooter className="dashboard-rail-tools">
                <SidebarModeMenu mode={sidebarMode} onModeChange={changeSidebarMode} />
              </SidebarFooter>
            </Sidebar>
  
            <main ref={mainRef} className="dashboard-main" data-section={section} aria-labelledby="dashboard-title">
              {!showingSettings && <header className="dashboard-page-heading">
                <Badge variant="outline" className="w-fit text-muted-foreground">پیش‌نمایش</Badge>
                <h1 ref={headingRef} id="dashboard-title" tabIndex={-1} className="outline-none">
                  {section === "overview" ? <>داشبورد {companyName && <bdi dir="auto">{companyName}</bdi>}</> : sectionTitle}
                </h1>
              </header>}
              <TabsContent value="overview" className="grid gap-6">
                <div className="dashboard-overview">
                  <Card className="dashboard-org-card gap-4 shadow-none">
                    <CardHeader>
                      <CardTitle>نمای کلی سازمان</CardTitle>
                      <CardDescription>وضعیت فضای کاری و دسترسی به داده‌ها</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ItemGroup className="gap-3">
                        <Item size="sm" className="p-0">
                          <ItemMedia variant="icon" className="size-10 rounded-md border-0 bg-accent text-accent-foreground"><Building2 aria-hidden="true" /></ItemMedia>
                          <ItemContent>
                            <ItemDescription className="text-xs">سازمان</ItemDescription>
                            <ItemTitle className="font-semibold"><bdi dir="auto">{workspaceName}</bdi></ItemTitle>
                          </ItemContent>
                        </Item>
                        <ItemSeparator className="bg-divider" />
                        <Item size="sm" className="p-0">
                          <ItemMedia variant="icon" className="size-10 rounded-md border-0 bg-accent text-accent-foreground"><Server aria-hidden="true" /></ItemMedia>
                          <ItemContent>
                            <ItemDescription className="text-xs">وضعیت اتصال</ItemDescription>
                            <ItemTitle className="font-semibold">در انتظار اتصال</ItemTitle>
                          </ItemContent>
                        </Item>
                      </ItemGroup>
                    </CardContent>
                  </Card>
                  <Card className="dashboard-data-surface gap-0 shadow-none">
                    <Card className="w-full max-w-56 gap-2 border-divider py-4 shadow-none">
                      <CardHeader className="px-4">
                        <Database className="mb-2 size-5 text-ring" aria-hidden="true" />
                        <CardTitle>منبع داده</CardTitle>
                        <CardDescription>اتصال فعال وجود ندارد</CardDescription>
                      </CardHeader>
                    </Card>
                  </Card>
                </div>
                <ActivitySummary period={period} onPeriodChange={setPeriod} />
              </TabsContent>
              <TabsContent value="activity"><ActivitySummary period={period} onPeriodChange={setPeriod} /></TabsContent>
              <TabsContent value="connections"><Connections /></TabsContent>
              <TabsContent value="settings">
                <DashboardSettings preferences={preferences} onPreferenceChange={changePreference}
                  sidebarMode={sidebarMode} onSidebarChange={changeSidebarMode} onReset={resetPreferences}
                  themeMode={themeMode} onThemeChange={onThemeChange} headingRef={headingRef} />
              </TabsContent>
              </main>
  
            {wide && (
              <aside id="dashboard-details" className="dashboard-details" inert={!detailsOpen} aria-hidden={!detailsOpen} aria-labelledby="dashboard-details-title">
                <div className="dashboard-details-header">
                  <h2 id="dashboard-details-title" className="text-sm font-semibold">جزئیات محیط</h2>
                  <IconAction label="بستن پنل جزئیات" onClick={closeDesktopDetails}><X aria-hidden="true" /></IconAction>
                </div>
                <WorkspaceDetails version={version} onViewConnections={viewConnections} />
              </aside>
            )}
          </Tabs>
        </SidebarProvider>

        {!wide && (
          <Sheet open={mobileDetails} onOpenChange={setMobileDetails}>
            <SheetContent id="dashboard-details" side="left" dir="rtl" className="gap-0 overflow-y-auto [&>button]:right-auto [&>button]:left-4"
              onCloseAutoFocus={event => {
                event.preventDefault()
                detailsTrigger.current?.focus()
              }}>
              <SheetHeader className="pe-12 text-right">
                <SheetTitle>جزئیات محیط</SheetTitle>
                <SheetDescription>وضعیت اجرا و اتصال داده‌ها</SheetDescription>
              </SheetHeader>
              <WorkspaceDetails version={version} onViewConnections={viewConnections} />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </TooltipProvider>
  )
}

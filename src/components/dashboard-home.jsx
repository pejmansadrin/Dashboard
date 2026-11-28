import { PreviewMark } from "./preview-mark"
import { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react"
import { Globe2, Lightbulb, LogOut, Moon, Network, PanelLeft, PanelRight, Search, Sun, TriangleAlert, UserRound, X } from "lucide-react"
import { appearanceDefaults, navigationGroups, previewModules, sections, timezones } from "./dashboard-options"
import { WorkspaceClock } from "./workspace-clock"
import { ContentSkeleton } from "./dashboard-skeleton"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Sidebar, SidebarContent, SidebarFooter, SidebarProvider } from "./ui/sidebar"
import { Separator } from "./ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import zilberLogo from "../assets/zilber.svg"

const Overview = lazy(() => import("./dashboard-overview"))
const DeveloperWorkspace = import.meta.env.DEV ? lazy(() => import("./developer-workspace")) : null
const ModulePreview = lazy(() => import("./dashboard-module-preview"))
const ActivitySummary = lazy(() => import("./dashboard-activity"))
const Connections = lazy(() => import("./dashboard-connections"))
const DashboardSettings = lazy(() => import("./dashboard-settings"))
const WorkspaceDetails = lazy(() => import("./workspace-details"))

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

function ProfileMenu({ workspaceName, version, themeMode, onThemeChange, onExit, timezone, changeTimezone }) {
  const resolvedTimezone = timezone === "auto" ? Intl.DateTimeFormat().resolvedOptions().timeZone : timezone
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
          <DropdownMenuSubTrigger><UserRound aria-hidden="true" /> حساب کاربری <PreviewMark /></DropdownMenuSubTrigger>
          <DropdownMenuSubContent ref={animateFrameLight} dir="rtl" className="profile-menu neon-frame w-56">
            <DropdownMenuLabel className="grid gap-1">
              <span>کاربر آزمایشی <PreviewMark /></span>
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

const dashboardDefaults = {
  showPreviewMarks: true,
  ...appearanceDefaults,
  homePage: "overview", showActivity: true, showData: true, searchShortcut: true,
  showClock: false, timezone: "auto", calendar: "persian", hourFormat: "24",
  palette: "tokyo", compact: false, reduceMotion: false, openDetails: false, defaultPeriod: "60m" }

function readDashboardPreferences() {
  try {
    const stored = JSON.parse(localStorage.getItem("dashboard-preferences")) ?? {}
    const preferences = { ...dashboardDefaults, ...stored }
    const zone = stored.timezone ?? localStorage.getItem("dashboard-timezone")
    preferences.timezone = Object.hasOwn(timezones, zone) ? zone : "auto"
    if (!sections.some(item => item.id === preferences.homePage)) preferences.homePage = "overview"
    return preferences
  } catch {
    return dashboardDefaults
  }
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

function DashboardSearch({ onChoose, shortcut }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!shortcut) return
    function onKey(event) {
      if (!(event.ctrlKey || event.metaKey) || event.code !== "KeyK" || event.altKey || event.shiftKey || event.repeat) return
      if (document.querySelector('[role="dialog"], [role="menu"]')) return
      event.preventDefault()
      setOpen(true)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [shortcut])

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

export function DashboardHome({ companyName, version, onExit, headingRef, dark, onToggleTheme, previewControls, themeMode, onThemeChange }) {
  const focusedInitialHeading = useRef(false)
  function setDashboardHeading(node) {
    headingRef.current = node
    if (node && !focusedInitialHeading.current) {
      focusedInitialHeading.current = true
      node.focus()
    }
  }
  const [overPrimaryOption, setOverPrimaryOption] = useState(false)
  const [preferences, setPreferences] = useState(readDashboardPreferences)
  const [section, setSection] = useState(preferences.homePage)
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
  const [toolbarTarget, setToolbarTarget] = useState(null)
  const hasToolbar = section === "activity" || previewModules.some(item => item.id === section)
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
    onThemeChange("dark")
    localStorage.removeItem("dashboard-timezone")
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
      <div dir="rtl" className="dashboard-shell" data-palette={preferences.palette} data-compact={preferences.compact} data-reduce-motion={preferences.reduceMotion}
        data-text-size={preferences.textSize} data-contrast={preferences.contrast} data-strong-focus={preferences.strongFocus}
        data-content-width={preferences.contentWidth} data-corners={preferences.corners} data-nav-size={preferences.navSize}
        data-glass={preferences.glass} data-neon={preferences.neon} data-grid={preferences.grid}
        data-preview-marks={import.meta.env.DEV ? preferences.showPreviewMarks : true}>
        <header className="dashboard-header">
          <nav aria-label="دسترسی سریع" className="flex items-center gap-1">
            {[["overview", "نمای کلی"], ["sales", "مشتریان"], ["inventory", "محصولات"], ["settings", "تنظیمات"]].map(([id, label]) => (
              <Button key={id} variant="ghost" size="sm" aria-current={section === id ? "page" : undefined}
                className={section === id ? "font-semibold" : "text-muted-foreground"} onClick={() => changeSection(id)}>{label}</Button>
            ))}
          </nav>
          <div className="dashboard-header-actions">
            <FeedbackMenu />
            <DashboardSearch shortcut={preferences.searchShortcut} onChoose={changeSection} />
            <IconAction label={dark ? "فعال کردن حالت روشن" : "فعال کردن حالت تیره"} onClick={onToggleTheme}>
              {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </IconAction>
            {!showingSettings && <IconAction label={detailsOpen ? "بستن جزئیات محیط" : "باز کردن جزئیات محیط"}
              ref={detailsTrigger} aria-expanded={detailsOpen}
              aria-controls={wide || detailsOpen ? "dashboard-details" : undefined} onClick={toggleDetails}>
              <PanelLeft aria-hidden="true" />
            </IconAction>}
            <Separator orientation="vertical" className="h-5 bg-divider" />
            <ProfileMenu timezone={preferences.timezone} changeTimezone={value => changePreference("timezone", value)} workspaceName={workspaceName} version={version} themeMode={themeMode} onThemeChange={onThemeChange} onExit={onExit} />
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
              <a href="https://zilber.tech/" className="workspace-brand">
                <img src={zilberLogo} alt="زیلبر" width="30" height="30" />
                <span><strong>{workspaceName}</strong><small>فضای کاری زیلبر</small></span>
              </a>
              <SidebarContent className="dashboard-rail-content w-full">
                <TabsList aria-label="بخش‌های داشبورد" className="dashboard-rail-list">
                  {navigationGroups.map((group, index) => (
                    <div key={group.title} role="group" aria-label={group.title} className="dashboard-rail-group">
                      {index > 0 && <Separator decorative className="dashboard-rail-group-divider bg-divider" />}
                        {sections.filter(item => group.ids.includes(item.id)).map(({ id, title, icon: Icon }) => (
                          <Tooltip key={id}>
                            <TooltipTrigger asChild>
                              <TabsTrigger value={id} className={id === "settings" ? "dashboard-nav-item dashboard-settings-link" : "dashboard-nav-item"} aria-label={id === "settings" ? "تنظیمات داشبورد" : title}
                                onPointerEnter={event => {
                                  if (showingSettings && wide && event.pointerType === "mouse") setOverPrimaryOption(true)
                                }}>
                                <Icon aria-hidden="true" />
                                <span>{title}</span>
                                {(id === "activity" || id === "connections" || previewModules.some(module => module.id === id)) && <PreviewMark />}
                              </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="left" dir="rtl">{title}</TooltipContent>
                          </Tooltip>
                        ))}
                    </div>
                  ))}
                </TabsList>
              </SidebarContent>
              <SidebarFooter className="dashboard-rail-tools">
                <SidebarModeMenu mode={sidebarMode} onModeChange={changeSidebarMode} />
              </SidebarFooter>
            </Sidebar>
  
            <main ref={mainRef} className="dashboard-main" data-section={section} data-toolbar={hasToolbar} aria-labelledby="dashboard-title">
              {!showingSettings && <header className={hasToolbar ? "module-subnav" : "dashboard-page-heading"}>
                <div className="grid gap-1">
                <Badge variant="outline" className="w-fit text-muted-foreground"><PreviewMark /> پیش‌نمایش</Badge>
                <h1 ref={setDashboardHeading} id="dashboard-title" tabIndex={-1} className="outline-none">
                  {section === "overview" ? <>داشبورد {companyName && <bdi dir="auto">{companyName}</bdi>}</> : section === "activity" ? "فعالیت سامانه" : sectionTitle}
                </h1>
                {preferences.showClock && <WorkspaceClock preferences={preferences} />}
                </div>
                {section === "overview" && <Button size="sm" onClick={async () => (await import("./dashboard-overview")).downloadOverview()}>دانلود گزارش</Button>}
                {hasToolbar && <div ref={setToolbarTarget} className="module-subnav-controls" />}
              </header>}
              <TabsContent value="overview" className="grid gap-6">
                {section === "overview" && <Suspense fallback={<ContentSkeleton variant="overview" />}>
                  <Overview preferences={preferences} workspaceName={workspaceName} period={period} onPeriodChange={setPeriod} />
                </Suspense>}
              </TabsContent>
              <TabsContent value="activity">
                {section === "activity" && <Suspense fallback={<ContentSkeleton variant="activity" />}><ActivitySummary standalone toolbarTarget={toolbarTarget} period={period} onPeriodChange={setPeriod} /></Suspense>}
              </TabsContent>
              <TabsContent value="connections">
                {section === "connections" && <Suspense fallback={<ContentSkeleton variant="connections" />}><Connections /></Suspense>}
              </TabsContent>
              <TabsContent value="settings">
                {section === "settings" && <Suspense fallback={<ContentSkeleton variant="settings" />}>
                  <DashboardSettings preferences={preferences} onPreferenceChange={changePreference}
                  sidebarMode={sidebarMode} onSidebarChange={changeSidebarMode} onReset={resetPreferences}
                  themeMode={themeMode} onThemeChange={onThemeChange} headingRef={setDashboardHeading} />
                </Suspense>}
              </TabsContent>
              {DeveloperWorkspace && (
                <TabsContent value="developer">
                  {section === "developer" && <Suspense fallback={<ContentSkeleton variant="overview" />}>
                    <DeveloperWorkspace version={version} previewControls={previewControls} onNavigate={changeSection}
                      themeMode={themeMode} onThemeChange={onThemeChange}
                      showMarks={preferences.showPreviewMarks} onShowMarksChange={value => changePreference("showPreviewMarks", value)} />
                  </Suspense>}
                </TabsContent>
              )}
              {previewModules.map(module => (
                <TabsContent key={module.id} value={module.id}>
                  {section === module.id && (
                    <Suspense fallback={<ContentSkeleton variant="activity" />}>
                      <ModulePreview toolbarTarget={toolbarTarget} module={module} />
                    </Suspense>
                  )}
                </TabsContent>
              ))}
              </main>
  
            {wide && (
              <aside id="dashboard-details" className="dashboard-details" inert={!detailsOpen} aria-hidden={!detailsOpen} aria-labelledby="dashboard-details-title">
                <div className="dashboard-details-header">
                  <h2 id="dashboard-details-title" className="text-sm font-semibold">جزئیات محیط</h2>
                  <IconAction label="بستن پنل جزئیات" onClick={closeDesktopDetails}><X aria-hidden="true" /></IconAction>
                </div>
                {detailsOpen && <Suspense fallback={<ContentSkeleton variant="details" />}><WorkspaceDetails version={version} onViewConnections={viewConnections} /></Suspense>}
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
              {detailsOpen && <Suspense fallback={<ContentSkeleton variant="details" />}><WorkspaceDetails version={version} onViewConnections={viewConnections} /></Suspense>}
            </SheetContent>
          </Sheet>
        )}
      </div>
    </TooltipProvider>
  )
}

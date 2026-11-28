import { useState } from "react"
import { Activity, Building2, Globe2, LayoutDashboard, Palette, Search } from "lucide-react"
import { PreviewMark } from "./preview-mark"
import { adminSettingsPreview } from "./admin-settings-preview"
import { appearanceGroups, sections, periods, timezones, calendars, dashboardPalettes } from "./dashboard-options"
import { WorkspaceClock } from "./workspace-clock"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty"
import { Field, FieldDescription, FieldLabel } from "./ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { Input } from "./ui/input"
import { NativeSelect, NativeSelectOption } from "./ui/native-select"
import { Separator } from "./ui/separator"
import { Switch } from "./ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

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
  { id: "workspace", title: "فضای کاری", icon: Building2, keywords: "خانه شروع صفحه ورود پیش فرض میانبر جستجو جست‌وجو کارت خلاصه فعالیت منبع داده", description: "صفحهٔ شروع، کارت‌های نمای کلی و میانبر جست‌وجو" },
  { id: "regional", title: "تاریخ و ساعت", icon: Globe2, keywords: "زمان منطقه زمانی تهران تقویم شمسی میلادی ساعت ۱۲ ۲۴", description: "تنظیم زمان محلی و قالب تاریخ داشبورد" },
  { id: "appearance", title: "ظاهر و حرکت", icon: Palette, keywords: "تم رنگ پالت روشن تیره سیستم انیمیشن کاهش حرکت " + appearanceGroups.flatMap(group => [group.title, ...group.fields.map(field => field.title)]).join(" "), description: "تم، خوانایی، فرم و جلوه‌های داشبورد" },
  { id: "layout", title: "چیدمان و ناوبری", icon: LayoutDashboard, keywords: "سایدبار منو جزئیات فضای کار فشرده هاور", description: "حالت سایدبار و نحوهٔ نمایش فضای کار" },
  { id: "activity", title: "فعالیت", icon: Activity, keywords: "بازه پیش فرض زمان ساعت روز آمار", description: "بازهٔ زمانی نمایش فعالیت سامانه" },
  ...adminSettingsPreview,
]

function SettingsGroup({ title, children }) {
  return (
    <section className="grid gap-3">
      <h3 className="text-base font-semibold">{title}</h3>
      <Card className="gap-0 py-0 shadow-none">{children}</Card>
    </section>
  )
}

const settingsNavGroups = [
  { title: "تنظیمات شخصی", ids: ["workspace", "regional", "appearance", "layout", "activity"] },
  { title: "مدیریت سازمان", ids: ["access", "security", "notifications"] },
  { title: "داده و زیرساخت", ids: ["backup", "audit", "integrations"] },
]

const sampleMembers = [{ email: "demo@example.com", access: ["overview"] }]

function MemberManagementPreview({ members, setMembers }) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  function addMember(event) {
    event.preventDefault()
    const address = email.trim().toLowerCase()
    if (members.some(member => member.email === address)) {
      setError("این ایمیل قبلاً اضافه شده است.")
      return
    }
    setMembers(current => [...current, { email: address, access: ["overview"] }])
    setEmail("")
    setError("")
  }

  return (
    <SettingsGroup title="مدیریت کاربران">
      <form onSubmit={addMember} className="member-add-form">
        <Field className="min-w-0 gap-2">
          <FieldLabel htmlFor="preview-member-email">ایمیل کاربر جدید</FieldLabel>
          <Input id="preview-member-email" dir="ltr" type="email" autoComplete="off" required value={email}
            aria-invalid={Boolean(error)} aria-describedby={error ? "preview-member-error" : undefined}
            onChange={event => { setEmail(event.target.value); setError("") }} />
          {error && <FieldDescription id="preview-member-error" role="alert">{error}</FieldDescription>}
        </Field>
        <Button type="submit">افزودن کاربر</Button>
      </form>
      <Separator className="bg-divider" />
      {members.length === 0 && <p className="settings-row text-sm text-muted-foreground">فهرست کاربران خالی است.</p>}
      {members.map((member, index) => (
        <section key={member.email} aria-label={member.email} className="member-access-card">
          {index > 0 && <Separator className="bg-divider" />}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <bdi className="min-w-0 break-all text-sm font-semibold">{member.email}</bdi>
            <Button type="button" variant="outline" size="sm" aria-label={`حذف کاربر ${member.email}`}
              onClick={() => setMembers(current => current.filter(item => item.email !== member.email))}>حذف کاربر</Button>
          </div>
          <div className="member-permissions">
            {sections.map(({ id, title }) => (
              <Field key={id} orientation="horizontal" className="member-permission justify-between gap-3">
                <FieldLabel htmlFor={`member-${member.email}-${id}`}>{title}</FieldLabel>
                <Switch id={`member-${member.email}-${id}`} dir="ltr" className="data-[size=default]:h-5"
                  checked={member.access.includes(id)}
                  onCheckedChange={checked => setMembers(current => current.map(item => item.email === member.email
                    ? { ...item, access: checked ? [...item.access, id] : item.access.filter(permission => permission !== id) }
                    : item))} />
              </Field>
            ))}
          </div>
        </section>
      ))}
    </SettingsGroup>
  )
}

export default function DashboardSettings({ preferences, onPreferenceChange, sidebarMode, onSidebarChange, onReset, themeMode, onThemeChange, headingRef }) {
  const [section, setSection] = useState("appearance")
  const [query, setQuery] = useState("")
  const [previewValues, setPreviewValues] = useState({})
  const [members, setMembers] = useState(sampleMembers)
  const search = query.trim().replaceAll("‌", " ")
  const matches = settingsSections.filter(item => [
    item.title, item.description, item.keywords,
    ...(item.fields ?? []).flatMap(field => [field.title, field.description, ...Object.values(field.options ?? {})]),
  ].join(" ").replaceAll("‌", " ").includes(search))
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
          {settingsNavGroups.map(group => {
            const items = settingsSections.filter(item => group.ids.includes(item.id))
            const groupVisible = items.some(item => matches.includes(item))
            return (
              <div key={group.title} role="group" aria-label={group.title} inert={!groupVisible}>
                <div className="settings-result settings-group-label flex items-center gap-2 px-2 text-xs font-medium text-muted-foreground"
                  data-visible={groupVisible} aria-hidden="true">
                  <span className="shrink-0">{group.title}</span>
                  <Separator className="min-w-0 flex-1 bg-divider" />
                </div>
                {items.map((item, index) => {
                  const visible = matches.includes(item)
                  const Icon = item.icon
                  return (
                    <div key={item.id} className="settings-result" data-visible={visible}
                      inert={!visible} style={{ "--result-delay": index * 24 + "ms" }}>
                      <TabsTrigger value={item.id} disabled={!visible} className="settings-tab" aria-label={item.title}>
                        <Icon aria-hidden="true" /><span className="module-nav-label">{item.title}</span>{item.fields && <PreviewMark />}
                      </TabsTrigger>
                    </div>
                  )
                })}
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
        <TabsContent value="workspace" className="settings-panel">
          <SettingsGroup title="ورود و دسترسی سریع">
            <SettingSelect id="home-page" title="صفحهٔ شروع" description="در ورود بعدی این بخش باز می‌شود."
              value={preferences.homePage} onChange={value => onPreferenceChange("homePage", value)}
              options={Object.fromEntries(sections.map(item => [item.id, item.title]))} />
            <Separator className="bg-divider" />
            <SettingToggle id="search-shortcut" title="میانبر جست‌وجو" description="با Ctrl+K یا ⌘K جست‌وجوی داشبورد باز شود."
              checked={preferences.searchShortcut} onCheckedChange={value => onPreferenceChange("searchShortcut", value)} />
          </SettingsGroup>
          <SettingsGroup title="کارت‌های نمای کلی">
            <SettingToggle id="show-activity" title="خلاصهٔ فعالیت" description="زبانهٔ تحلیل فعالیت در صفحهٔ اصلی فعال باشد."
              checked={preferences.showActivity} onCheckedChange={value => onPreferenceChange("showActivity", value)} />
            <Separator className="bg-divider" />
            <SettingToggle id="show-data" title="نمودار درآمد" description="نمودار درآمد ماهانه در نمای کلی نمایش داده شود."
              checked={preferences.showData} onCheckedChange={value => onPreferenceChange("showData", value)} />
          </SettingsGroup>
        </TabsContent>
        <TabsContent value="regional" className="settings-panel">
          <SettingsGroup title="زمان محلی">
            <SettingToggle id="show-clock" title="نمایش تاریخ و ساعت" description="تاریخ و ساعت زیر عنوان صفحات داشبورد دیده شود."
              checked={preferences.showClock} onCheckedChange={value => onPreferenceChange("showClock", value)} />
            <Separator className="bg-divider" />
            <SettingSelect id="region-zone" title="منطقهٔ زمانی" description="این انتخاب با منوی پروفایل مشترک است."
              value={preferences.timezone} onChange={value => onPreferenceChange("timezone", value)} options={timezones} />
            <Separator className="bg-divider" />
            <SettingSelect id="region-calendar" title="تقویم" description="قالب تاریخ در فضای کاری"
              value={preferences.calendar} onChange={value => onPreferenceChange("calendar", value)} options={calendars} />
            <Separator className="bg-divider" />
            <SettingSelect id="region-hour" title="قالب ساعت" description="نحوهٔ نمایش ساعت و دقیقه"
              value={preferences.hourFormat} onChange={value => onPreferenceChange("hourFormat", value)} options={{ 12: "۱۲ ساعته", 24: "۲۴ ساعته" }} />
          </SettingsGroup>
          <WorkspaceClock preferences={preferences} />
        </TabsContent>
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
          {appearanceGroups.map(group => (
            <SettingsGroup key={group.title} title={group.title}>
              {group.fields.map(({ id, title, description, options }, index) => (
                <div key={id}>
                  {index > 0 && <Separator className="bg-divider" />}
                  {options
                    ? <SettingSelect id={id} title={title} description={description} options={options}
                        value={preferences[id]} onChange={value => onPreferenceChange(id, value)} />
                    : <SettingToggle id={id} title={title} description={description}
                        checked={preferences[id]} onCheckedChange={value => onPreferenceChange(id, value)} />}
                </div>
              ))}
            </SettingsGroup>
          ))}
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
        {active?.fields && (
          <TabsContent value={active.id} className="settings-panel" key={active.id}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary"><PreviewMark /> پیش‌نمایش تعاملی</Badge>
              <p className="text-sm text-muted-foreground">انتخاب‌ها آزمایشی‌اند. اجرای این سیاست‌ها به اتصال سرویس سازمان نیاز دارد.</p>
            </div>
            {active.id === "access" && <MemberManagementPreview members={members} setMembers={setMembers} />}
            <SettingsGroup title="سیاست‌های سازمان">
              {active.fields.map((field, index) => {
                const id = `preview-${active.id}-${field.id}`
                const value = previewValues[id] ?? field.initial
                const update = next => setPreviewValues(current => ({ ...current, [id]: next }))
                const label = { id, title: <>{field.title} <PreviewMark /></>, description: field.description }
                return (
                  <div key={id}>
                    {index > 0 && <Separator className="bg-divider" />}
                    {field.options
                      ? <SettingSelect {...label} value={value} options={field.options} onChange={update} />
                      : <SettingToggle {...label} checked={value} onCheckedChange={update} />}
                  </div>
                )
              })}
            </SettingsGroup>
          </TabsContent>
        )}
        {active?.fields ? (
          <footer className="settings-shell-footer">
            <p className="text-xs text-muted-foreground">با خروج از تنظیمات، انتخاب‌های آزمایشی پاک می‌شوند.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => { setPreviewValues({}); setMembers(sampleMembers) }}>بازنشانی همهٔ پیش‌نمایش‌ها</Button>
          </footer>
        ) : <footer className="settings-shell-footer">
          <p className="text-xs text-muted-foreground">ترجیحات نمایش در همین مرورگر ذخیره می‌شوند.</p>
          <Button type="button" variant="outline" size="sm" onClick={onReset}>بازنشانی تنظیمات</Button>
        </footer>}
      </div>
    </Tabs>
  )
}


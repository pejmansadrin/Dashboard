import { Activity, Bell, Briefcase, CalendarDays, ClipboardList, CodeXml, FileText, Headphones, LayoutDashboard, Network, Package, Settings2, Users, Wallet } from "lucide-react"

export const previewModules = [
  { id: "reports", title: "گزارش‌ها", icon: FileText },
  { id: "inbox", title: "کارتابل", icon: ClipboardList },
  { id: "notifications", title: "اعلان‌ها", icon: Bell },
  { id: "calendar", title: "تقویم", icon: CalendarDays },
  { id: "sales", title: "فروش و مشتریان", icon: Users },
  { id: "finance", title: "مالی", icon: Wallet },
  { id: "projects", title: "پروژه‌ها", icon: Briefcase },
  { id: "inventory", title: "انبار و خرید", icon: Package },
  { id: "support", title: "پشتیبانی", icon: Headphones },
  { id: "people", title: "منابع انسانی", icon: Users },
  { id: "documents", title: "اسناد و قراردادها", icon: FileText },
]

export const sections = [
  { id: "overview", title: "نمای کلی", icon: LayoutDashboard },
  { id: "activity", title: "فعالیت", icon: Activity },
  { id: "connections", title: "اتصال‌ها", icon: Network },
  ...previewModules,
  { id: "settings", title: "تنظیمات", icon: Settings2 },
  ...(import.meta.env.DEV ? [{ id: "developer", title: "توسعه‌دهنده", icon: CodeXml }] : []),
]

export const navigationGroups = [
  { title: "نمای کلی و گزارش‌ها", ids: ["overview", "activity", "reports"] },
  { title: "کارهای روزانه", ids: ["inbox", "notifications", "calendar"] },
  { title: "عملیات شرکت", ids: ["sales", "finance", "projects", "inventory", "support"] },
  { title: "امور داخلی", ids: ["people", "documents"] },
  { title: "مدیریت داشبورد", ids: ["connections", "settings", "developer"] },
]

export const periods = {
  "60m": "۶۰ دقیقهٔ اخیر",
  "24h": "۲۴ ساعت اخیر",
  "7d": "۷ روز اخیر",
}

export const timezones = { auto: "طبق دستگاه", "Asia/Tehran": "تهران", UTC: "UTC" }
export const calendars = { persian: "هجری شمسی", gregory: "میلادی" }

export const dashboardPalettes = {
  tokyo: "توکیو نایت",
  azure: "آبی",
  mint: "نعنایی",
  amber: "کهربایی",
}

export const appearanceGroups = [
  { title: "خوانایی", fields: [
    { id: "textSize", title: "اندازهٔ متن", description: "اندازهٔ عنوان‌ها و متن رابط", initial: "standard", options: { small: "کوچک", standard: "استاندارد", large: "بزرگ" } },
    { id: "contrast", title: "کنتراست بیشتر", description: "متن فرعی و مرز عناصر واضح‌تر شوند.", initial: false },
    { id: "strongFocus", title: "حلقهٔ فوکوس برجسته", description: "هنگام کار با صفحه‌کلید، عنصر فعال واضح‌تر دیده شود.", initial: false },
  ] },
  { title: "اندازه و فرم", fields: [
    { id: "contentWidth", title: "عرض محتوا", description: "عرض صفحات در نمایشگرهای بزرگ", initial: "fluid", options: { fluid: "تمام عرض", centered: "متمرکز" } },
    { id: "corners", title: "گردی گوشه‌ها", description: "شعاع کنترل‌ها و کارت‌های داشبورد", initial: "standard", options: { sharp: "کم", standard: "استاندارد", soft: "گرد" } },
    { id: "navSize", title: "ارتفاع ردیف‌های ناوبری", description: "اندازهٔ دکمه‌ها در سایدبار و زیرمنو", initial: "standard", options: { small: "فشرده", standard: "استاندارد", large: "بزرگ" } },
  ] },
  { title: "جلوه‌های بصری", fields: [
    { id: "glass", title: "جلوهٔ شیشه‌ای", description: "تاری پس‌زمینه در هدر و سایدبار", initial: true },
    { id: "neon", title: "نور نئونی", description: "تابش نشانگر فعال و قاب پنجره‌های شناور", initial: true },
    { id: "grid", title: "خطوط راهنمای نمودار", description: "خطوط افقی نمودار درآمد در نمای کلی", initial: true },
  ] },
]

export const appearanceDefaults = Object.fromEntries(
  appearanceGroups.flatMap(group => group.fields.map(field => [field.id, field.initial])),
)


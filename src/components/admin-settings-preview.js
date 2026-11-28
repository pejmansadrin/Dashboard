import { Bell, DatabaseBackup, FileClock, Plug, ShieldCheck, Users } from "lucide-react"

export const adminSettingsPreview = [
  {
    id: "access", title: "اعضا و دسترسی‌ها", icon: Users, description: "دعوت همکاران و سطح دسترسی اولیهٔ اعضا",
    fields: [
      { id: "role", title: "نقش پیش‌فرض عضو جدید", description: "سطح دسترسی پس از پذیرش دعوت‌نامه", initial: "viewer", options: { viewer: "مشاهده‌گر", editor: "ویرایشگر" } },
      { id: "approval", title: "تأیید مدیر", description: "عضویت جدید به تأیید مدیر سازمان نیاز داشته باشد.", initial: true },
      { id: "invite", title: "اعتبار دعوت‌نامه", description: "مدت قابل استفاده بودن لینک دعوت", initial: "7", options: { 1: "یک روز", 7: "یک هفته", 30: "یک ماه" } },
    ],
  },
  {
    id: "security", title: "امنیت و نشست‌ها", icon: ShieldCheck, description: "سیاست ورود و مدت اعتبار نشست‌های کاربران",
    fields: [
      { id: "mfa", title: "ورود دومرحله‌ای", description: "مدیران هنگام ورود مرحلهٔ تأیید دوم را طی کنند.", initial: true },
      { id: "idle", title: "پایان نشست غیرفعال", description: "مهلت بازگشت کاربر پیش از ورود مجدد", initial: "30", options: { 15: "۱۵ دقیقه", 30: "۳۰ دقیقه", 60: "یک ساعت" } },
      { id: "device", title: "اعلان دستگاه جدید", description: "ورود از دستگاه جدید به صاحب حساب اطلاع داده شود.", initial: true },
    ],
  },
  {
    id: "notifications", title: "اعلان‌های سازمان", icon: Bell, description: "کانال ارسال، خلاصهٔ فعالیت‌ها و هشدارهای سرویس",
    fields: [
      { id: "channel", title: "کانال دریافت", description: "مقصد اعلان‌های مدیران", initial: "inbox", options: { inbox: "صندوق داشبورد", email: "ایمیل", both: "هر دو" } },
      { id: "digest", title: "خلاصهٔ فعالیت‌ها", description: "فاصلهٔ ارسال گزارش فعالیت سازمان", initial: "weekly", options: { off: "غیرفعال", daily: "روزانه", weekly: "هفتگی" } },
      { id: "outage", title: "هشدار قطع سرویس", description: "هنگام قطع اتصال منبع داده، مدیران مطلع شوند.", initial: true },
    ],
  },
  {
    id: "backup", title: "پشتیبان‌گیری", icon: DatabaseBackup, description: "زمان‌بندی نسخه‌های پشتیبان و دورهٔ نگهداری",
    fields: [
      { id: "frequency", title: "زمان‌بندی پشتیبان‌گیری", description: "تناوب تهیهٔ نسخهٔ پشتیبان از داده‌های سازمان", initial: "daily", options: { daily: "روزانه", weekly: "هفتگی", manual: "دستی" } },
      { id: "retention", title: "نگهداری نسخه‌ها", description: "مدت نگهداری هر نسخه در فضای پشتیبان", initial: "30", options: { 7: "۷ روز", 30: "۳۰ روز", 90: "۹۰ روز" } },
      { id: "verify", title: "بررسی سلامت نسخه", description: "پس از پشتیبان‌گیری، خوانایی نسخه بررسی شود.", initial: true },
    ],
  },
  {
    id: "audit", title: "گزارش ممیزی", icon: FileClock, description: "رویدادهای قابل ثبت در تاریخچهٔ سازمان",
    fields: [
      { id: "logins", title: "ثبت رویدادهای ورود", description: "ورود موفق و ناموفق در تاریخچه ثبت شود.", initial: true },
      { id: "changes", title: "ثبت تغییر دسترسی", description: "تغییر نقش و مجوز اعضا در گزارش مدیران ثبت شود.", initial: true },
      { id: "period", title: "نگهداری گزارش‌ها", description: "بازهٔ دسترسی مدیران به رویدادهای گذشته", initial: "90", options: { 30: "۳۰ روز", 90: "۹۰ روز", 365: "یک سال" } },
    ],
  },
  {
    id: "integrations", title: "یکپارچه‌سازی‌ها", icon: Plug, description: "رفتار همگام‌سازی منابع و تحویل رویدادها",
    fields: [
      { id: "sync", title: "همگام‌سازی منابع", description: "فاصلهٔ دریافت تغییرات از سرویس متصل", initial: "15", options: { 5: "۵ دقیقه", 15: "۱۵ دقیقه", 60: "یک ساعت" } },
      { id: "retry", title: "تلاش مجدد", description: "ارسال ناموفق رویداد به سرویس مقصد دوباره امتحان شود.", initial: true },
      { id: "delivery", title: "گزارش تحویل وب‌هوک", description: "نتیجهٔ ارسال رویداد برای عیب‌یابی ثبت شود.", initial: false },
    ],
  },
]

import { createPortal } from "react-dom"
import { useState } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty"
import { Input } from "./ui/input"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "./ui/item"
import { NativeSelect, NativeSelectOption } from "./ui/native-select"

const samples = {
  reports: ["گزارش عملکرد ماهانه", "مقایسهٔ فروش شعب", "گزارش هزینه‌های عملیاتی"],
  inbox: ["تأیید درخواست خرید", "بررسی دسترسی همکار جدید", "پیگیری گزارش هفتگی"],
  notifications: ["گزارش ماهانه آماده شد", "مهلت بررسی درخواست نزدیک است", "مدیر پروژه تغییر کرد"],
  calendar: ["جلسهٔ بررسی عملکرد · شنبه ۱۰:۰۰", "تحویل گزارش · دوشنبه ۱۴:۳۰", "جلسهٔ برنامه‌ریزی · چهارشنبه ۹:۰۰"],
  sales: ["فرصت فروش شرکت سرو", "پیگیری مشتری آفتاب", "پیشنهاد همکاری شرکت سپهر"],
  finance: ["فاکتور خدمات خرداد", "پرداخت پیمانکار", "گزارش هزینهٔ شعبه"],
  projects: ["راه‌اندازی پرتال", "بازبینی فرایند تحویل", "به‌روزرسانی مستندات"],
  inventory: ["درخواست خرید اقلام اداری", "رسید انبار مرکزی", "بازبینی نقطهٔ سفارش"],
  support: ["درخواست بازیابی حساب", "پیگیری وضعیت سفارش", "بررسی کندی صفحه"],
  people: ["درخواست مرخصی", "ورود همکار جدید", "بررسی برنامهٔ آموزشی"],
  documents: ["قرارداد تأمین تجهیزات", "صورت‌جلسهٔ عملیاتی", "دستورالعمل خرید"],
}
const statuses = { open: "در انتظار", active: "در حال پیگیری", done: "تکمیل‌شده" }

export default function DashboardModulePreview({ module, toolbarTarget }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [selected, setSelected] = useState(null)
  const records = samples[module.id].map((title, index) => ({ title, status: Object.keys(statuses)[index] }))
  const visible = records.filter(record => record.title.includes(query.trim()) && (filter === "all" || record.status === filter))

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {Object.entries(statuses).map(([id, title]) => (
          <Card key={id} className="gap-2 py-4 shadow-none">
            <CardHeader>
              <CardDescription>{title}</CardDescription>
              <CardTitle>{records.filter(record => record.status === id).length.toLocaleString("fa-IR")}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      {toolbarTarget && createPortal(
          <div className="flex flex-wrap items-center gap-2">
            <Input type="search" value={query} onChange={event => setQuery(event.target.value)}
              className="min-w-36 flex-1" placeholder="جست‌وجو در فهرست" aria-label="جست‌وجو در فهرست" />
            <NativeSelect value={filter} onChange={event => setFilter(event.target.value)} aria-label="فیلتر وضعیت">
              <NativeSelectOption value="all">همهٔ وضعیت‌ها</NativeSelectOption>
              {Object.entries(statuses).map(([id, title]) => <NativeSelectOption key={id} value={id}>{title}</NativeSelectOption>)}
            </NativeSelect>
          </div>, toolbarTarget)}
      <Card aria-label="نتایج فهرست" className="py-4 shadow-none">
        <CardContent>
          {visible.length ? <ItemGroup className="gap-2">
            {visible.map(record => (
              <Item key={record.title} variant="outline" className="flex-wrap">
                <ItemContent>
                  <ItemTitle>{record.title}</ItemTitle>
                  <ItemDescription>{statuses[record.status]}</ItemDescription>
                </ItemContent>
                <ItemActions><Button type="button" variant="outline" size="sm" onClick={() => setSelected(record)}>جزئیات</Button></ItemActions>
              </Item>
            ))}
          </ItemGroup> : <Empty><EmptyHeader><EmptyTitle>موردی پیدا نشد</EmptyTitle><EmptyDescription>عبارت یا وضعیت دیگری انتخاب کن.</EmptyDescription></EmptyHeader></Empty>}
        </CardContent>
      </Card>
      <Dialog open={Boolean(selected)} onOpenChange={open => { if (!open) setSelected(null) }}>
        <DialogContent dir="rtl" className="text-right [&>button]:right-auto [&>button]:left-4">
          <DialogHeader className="pe-8 sm:text-right">
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>{module.title} · دادهٔ نمونه</DialogDescription>
          </DialogHeader>
          <Badge variant="outline">{statuses[selected?.status]}</Badge>
        </DialogContent>
      </Dialog>
    </div>
  )
}

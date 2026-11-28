import { Database, Network } from "lucide-react"
import { PreviewMark } from "./preview-mark"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty"
import { Separator } from "./ui/separator"

export default function WorkspaceDetails({ version, onViewConnections }) {
  return (
    <div className="grid content-start gap-4 p-4 text-right text-sm">
      <dl className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="text-muted-foreground">حالت اجرا</dt>
          <dd><Badge variant="secondary"><PreviewMark /> پیش‌نمایش</Badge></dd>
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
          <EmptyTitle className="text-sm">منبع داده متصل نیست <PreviewMark /></EmptyTitle>
          <EmptyDescription className="text-xs">شاخص‌ها پس از اتصال منبع داده در دسترس قرار می‌گیرند.</EmptyDescription>
        </EmptyHeader>
      </Empty>
      <Button type="button" variant="outline" size="sm" onClick={onViewConnections}>
        <Network aria-hidden="true" /> مشاهدهٔ اتصال‌ها
      </Button>
    </div>
  )
}


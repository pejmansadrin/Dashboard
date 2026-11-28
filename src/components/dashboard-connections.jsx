import { Plug } from "lucide-react"
import { PreviewMark } from "./preview-mark"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty"

export default function Connections() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>اتصال‌های سازمان <PreviewMark /></CardTitle>
      </CardHeader>
      <CardContent>
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Plug aria-hidden="true" /></EmptyMedia>
            <EmptyTitle>منبع داده متصل نیست <PreviewMark /></EmptyTitle>
            <EmptyDescription>پس از اتصال منبع دادهٔ سازمان، اطلاعات آن در این بخش نمایش داده می‌شود.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}


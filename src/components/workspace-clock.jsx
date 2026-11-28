import { useEffect, useState } from "react"

export function WorkspaceClock({ preferences }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const formatted = now.toLocaleString("fa-IR", {
    calendar: preferences.calendar, dateStyle: "medium", timeStyle: "short",
    timeZone: preferences.timezone === "auto" ? undefined : preferences.timezone,
    hourCycle: preferences.hourFormat === "12" ? "h12" : "h23",
  })
  return <time dateTime={now.toISOString()} className="text-xs tabular-nums text-muted-foreground">{formatted}</time>
}


import { Skeleton } from "./ui/skeleton"

export function ContentSkeleton({ variant }) {
  return (
    <div className={variant === "details" ? "grid gap-4 p-4" : "grid content-start gap-4 p-4"}
      role="status" aria-label="در حال بارگیری">
      <Skeleton className="h-6 w-40" />
      {variant === "activity" ? (
        <div className="dashboard-metrics grid gap-3">
          {[0, 1, 2, 3].map(index => <Skeleton key={index} className="h-24" />)}
        </div>
      ) : variant === "settings" ? (
        <div className="settings-workspace gap-4">
          <Skeleton className="h-44" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        <div className={variant === "overview" ? "dashboard-overview" : "grid gap-3"}>
          <Skeleton className="h-56" />
          {variant === "overview" && <Skeleton className="h-56" />}
        </div>
      )}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="dashboard-shell" dir="rtl">
      <div className="dashboard-header"><Skeleton className="h-8 w-44" /></div>
      <div className="dashboard-workspace">
        <div className="dashboard-rail" aria-hidden="true">
          {[0, 1, 2, 3].map(index => <Skeleton key={index} className="size-8" />)}
        </div>
        <main className="dashboard-main"><ContentSkeleton variant="overview" /></main>
      </div>
    </div>
  )
}

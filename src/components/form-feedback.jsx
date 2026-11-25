import { Alert, AlertDescription } from "./ui/alert"
import "./form-feedback.css"

export function FormFeedback({ id, open, tone = "error", children }) {
  const visible = Boolean(open && children)

  return (
    <div className="form-feedback-motion" data-open={visible} aria-hidden={!visible}>
      <div className="form-feedback-clip">
        {children && (
          <Alert id={id} role={tone === "error" ? "alert" : "status"}
            variant={tone === "error" ? "destructive" : "default"}>
            <AlertDescription>{children}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

if (/^\/dashboard(?:\/|$)/.test(window.location.pathname)) {
  import("./admin/main")
} else {
  import("./main.jsx")
}

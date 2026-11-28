import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src/admin", import.meta.url)) } },
  plugins: [
    tanstackRouter({
      target: "react",
      routesDirectory: "./src/admin/routes",
      generatedRouteTree: "./src/admin/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
})

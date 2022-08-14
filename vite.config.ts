import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

function pathResolve(dir: string) {
  return resolve(__dirname, ".", dir);
}

const shouldAnalyze = !!process.env.ANALYZE;

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: pathResolve("src") + "/"
      }
    ]
  },
  build: {
    rollupOptions: {
      plugins: shouldAnalyze ? [visualizer({ open: true, filename: "./bundle-size/bundle.html" })] : []
    },
    sourcemap: true
  },
  plugins: [
    react({
      jsxRuntime: "automatic",
    })
  ]
})

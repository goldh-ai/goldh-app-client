import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(import.meta.dirname, "."), "VITE_");
  const apiTarget = env.VITE_API_BASE_URL || "http://localhost:5001";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    envDir: path.resolve(import.meta.dirname, "."),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          configure(proxy) {
            proxy.on("proxyReq", (proxyReq) => {
              // Remote API allowlists Origin; browser sends localhost — rewrite to match target host.
              if (apiTarget.startsWith("https://")) {
                try {
                  const u = new URL(apiTarget);
                  proxyReq.setHeader("Origin", u.origin);
                  proxyReq.setHeader("Referer", `${u.origin}/`);
                } catch {
                  /* noop */
                }
              }
            });
          },
        },
      },
    },
  };
});

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Use __dirname instead of import.meta.dirname
export default defineConfig(async () => {
  const plugins = [
    react(),
  ];

  // Only load replit plugins in development
  if (process.env.NODE_ENV !== "production") {
    try {
      const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal");
      if (runtimeErrorOverlay?.default) {
        plugins.push(runtimeErrorOverlay.default());
      }
    } catch (e) {
      // Plugin not available, skip
    }

    if (process.env.REPL_ID !== undefined) {
      try {
        const cartographer = await import("@replit/vite-plugin-cartographer");
        if (cartographer?.cartographer) {
          plugins.push(cartographer.cartographer());
        }
      } catch (e) {
        // Plugin not available, skip
      }
    }
  }

  return {
    plugins,
    define: {
      'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || ''),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      // CSS optimization settings
      minify: 'esbuild',
      cssMinify: true,
      // Enable CSS code splitting for better caching
      cssCodeSplit: true,
      // Target modern browsers for smaller bundle
      target: 'es2015',
      // Chunk splitting strategy
      rollupOptions: {
        output: {
          // Manual chunks for better code splitting
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router'],
            'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
            'vendor-utils': ['clsx', 'tailwind-merge', 'lucide-react'],
          },
        },
      },
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
    // Enable optimized dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', '@radix-ui/react-dialog', 'lucide-react'],
    },
  };
});

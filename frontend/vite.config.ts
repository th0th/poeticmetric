import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  css: {
    modules: {
      localsConvention: "dashes",
    },
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
    preprocessorOptions: {
      scss: {
        loadPaths: ["./src/styles"],
        silenceDeprecations: ["mixed-decls", "color-functions", "global-builtin", "import"],
      },
    },
  },
  plugins: [nodePolyfills({ include: ["buffer"] }), react()],
  resolve: {
    alias: [
      {
        find: "~",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  server: {
    allowedHosts: true,
    hmr: {
      clientPort: 443,
      path: "/hmr",
    },
    host: true,
    strictPort: true,
  },
});

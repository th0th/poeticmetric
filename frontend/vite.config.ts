import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import postcssCustomMedia from "postcss-custom-media";

export default defineConfig({
  assetsInclude: ["**/*.md"],
  css: {
    modules: {
      localsConvention: "dashes",
    },
    postcss: {
      plugins: [
        autoprefixer(),
        postcssCustomMedia(),
      ],
    },
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "~",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  server: {
    hmr: {
      clientPort: 443,
      path: "/hmr",
    },
    host: true,
    strictPort: true,
  },
  ssr: {
    noExternal: ["react-helmet-async"],
  },
});

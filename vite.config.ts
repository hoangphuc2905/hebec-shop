import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";
import {
  default as tsconfigPaths,
  default as viteTsconfigPaths,
} from "vite-tsconfig-paths";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin(), tsconfigPaths()],
  server: {
    open: true,
    host: true,
    port: 5173,
  },
  // mode: "development",
  // build: {
  //   minify: false,
  // },

  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "primary-color": "#169c9f",
          "secondary-color": "#FFCB07",
          "border-radius-base": "5px",
        },
        javascriptEnabled: true,
        additionalData: "@root-entry-name: default;",
      },
    },
  },

  // optimizeDeps: {
  //   esbuildOptions: {
  //     plugins: [esbuildCommonjs(["react-calendar", "react-date-picker"])],
  //   },
  // },
});

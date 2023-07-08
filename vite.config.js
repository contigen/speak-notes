import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteJsconfigPaths from "vite-jsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/

export default defineConfig(() => ({
  plugins: [react(), viteJsconfigPaths(), svgrPlugin()],
}));

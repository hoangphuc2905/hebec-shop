import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Không cần cấu hình CSS ở đây, PostCSS sẽ tự động được tìm thấy
});

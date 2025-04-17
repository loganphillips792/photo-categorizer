import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // Proxy requests starting with /api to the Flask backend
            '/api': {
                target: 'http://127.0.0.1:5000', // Your backend server
                changeOrigin: true, // Needed for virtual hosted sites
                // Rewrite the path: remove /api prefix before forwarding
                rewrite: (path) => path.replace(/^\/api/, ''),
            }
        }
    }
});

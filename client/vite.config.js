import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/api": {
//         target: process.env.VITE_SERVER_BASE_URL || "http://localhost:5330",
//         secure: false,
//         changeOrigin: true,
//       },
//       "/uploads/": {
//         target: process.env.VITE_SERVER_BASE_URL || "http://localhost:5330",
//         secure: false,
//         changeOrigin: true,
//       },
//     },
//   },
// });

// Load environment variables
export default defineConfig(({ mode }) => {
  //const env = loadEnv(mode, process.cwd()); // Load .env variables
  const env = loadEnv(mode, path.resolve());

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_REACT_SERVER_BASE_URL || "http://localhost:5330",
          secure: false,
          changeOrigin: true,
        },
        "/uploads/": {
          target: env.VITE_REACT_SERVER_BASE_URL || "http://localhost:5330",
          secure: false,
          changeOrigin: true,
        },
      },
    },
  };
});

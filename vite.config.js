import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	server: {
		port: 5173,
		host: true,
	},
	build: {
		outDir: "dist",
		sourcemap: false, // Disable sourcemaps in production for smaller bundles
		minify: "terser", // Use terser for better minification
		target: "esnext", // Use esnext for better React compatibility
		rollupOptions: {
			output: {
				manualChunks: {
					// Split vendor dependencies into separate chunks
					react: ["react", "react-dom"],
					router: ["react-router-dom"],
					supabase: ["@supabase/supabase-js"],
					ui: ["lucide-react", "react-hot-toast"],
					utils: [
						"date-fns",
						"@dnd-kit/core",
						"@dnd-kit/sortable",
						"@dnd-kit/utilities",
					],
				},
				// Optimize chunk naming for better caching
				chunkFileNames: "assets/js/[name]-[hash].js",
				entryFileNames: "assets/js/[name]-[hash].js",
				assetFileNames: "assets/[name]-[hash].[ext]",
			},
		},
		// Enable chunk size warnings
		chunkSizeWarningLimit: 1000,
	},
	// Optimize dependencies during development
	optimizeDeps: {
		include: [
			"react",
			"react-dom",
			"react-router-dom",
			"react-helmet-async",
		],
	},
});

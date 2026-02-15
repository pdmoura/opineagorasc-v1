import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	root: "public",
	envDir: "../", // Load .env from project root, not from public/
	build: {
		outDir: "../public/dist",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				"main-public": resolve(__dirname, "public/js/main-public.js"),
				"main-admin": resolve(__dirname, "public/js/main-admin.js"),
				"main-login": resolve(__dirname, "public/js/main-login.js"),
			},
			output: {
				entryFileNames: "js/[name].js",
				chunkFileNames: "js/[name]-[hash].js",
				assetFileNames: (assetInfo) => {
					if (assetInfo.name.endsWith(".css")) {
						return "css/[name][extname]";
					}
					return "assets/[name]-[hash][extname]";
				},
			},
		},
		sourcemap: true,
	},
	server: {
		port: 5173,
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
	envPrefix: "VITE_",
});

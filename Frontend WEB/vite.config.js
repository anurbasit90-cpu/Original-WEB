import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	// Gunakan base relatif agar aset bekerja ketika di-upload ke public_html
	base: './',
	plugins: [react()],
	
	// ESBuild configuration
	esbuild: {
		target: 'esnext',
		// Remove console.log in production
		drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
	},
	
	build: {
		outDir: 'dist',
		sourcemap: false, // Disable sourcemaps in production for smaller bundle
		minify: 'terser', // Use terser for better compression
		terserOptions: {
			compress: {
				drop_console: true, // Remove console.log
				drop_debugger: true, // Remove debugger
				pure_funcs: ['console.log'], // Remove specific console methods
			},
		},
		rollupOptions: {
			output: {
				// Manual chunks for better caching
				manualChunks: {
					'react-vendor': ['react', 'react-dom'],
					'icons': ['lucide-react'],
				},
				// Optimize file names for better caching
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
				assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
			},
		},
		// Increase chunk size warning limit
		chunkSizeWarningLimit: 1000,
	},
	
	// Development server config
	server: {
		port: 5173,
		open: true, // Auto open browser
		strictPort: false, // Try next port if 5173 is busy
	},
	
	// Preview server config
	preview: {
		port: 4173,
		open: true,
	},
})


import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		strictPort: true,
		headers: {
			a: 'b',
		},
		proxy: {
			'/api': {
				target: 'https://proctoring.platon.uz',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, ''),
			},
		},
	},
	resolve: {
		alias: {
			'@components': '/src/components/',
			'@views': '/src/views/',
			'@stores': '/src/stores/',
		},
	},
	plugins: [vue()],
});

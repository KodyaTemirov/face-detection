import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
// https://vitejs.dev/config/
export default defineConfig({
	// TODO: возможно чуть позже понадобится.
	// server: {
	// 	strictPort: true,
	// 	headers: {
	// 		a: 'b',
	// 	},
	// 	proxy: {
	// 		'/api': {
	// 			target: 'https://proctoring.platon.uz',
	// 			changeOrigin: true,
	// 			rewrite: path => path.replace(/^\/api/, ''),
	// 		},
	// 	},
	// },
	resolve: {
		alias: {
			'@components': '/src/components/',
			'@views': '/src/views/',
			'@stores': '/src/stores/',
			'@utils': '/src/utils/',
		},
	},
	plugins: [vue(), svgLoader()],
});

import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
	plugins: [vue(), vueDevTools()],
	css: {
		postcss: {
			plugins: [tailwind(), autoprefixer()],
		},
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		target: 'esnext',
	},
});

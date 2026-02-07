import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { tsSvg } from '@ts-svg/svelte';

export default defineConfig({
	plugins: [
		sveltekit(),
		// Step 1: Add the vite plugin
		tsSvg({
			path: './src/lib/svgs',
		}),
	],
});

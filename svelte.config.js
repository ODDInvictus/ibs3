import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		sveltePreprocess()
	],
	kit: {
		adapter: adapter({
			envPrefix: '',
			out: 'build',
			precompress: false,
			polyfill: true,
		}),
		csrf: {
			checkOrigin: false
		}
	}
};

export default config;

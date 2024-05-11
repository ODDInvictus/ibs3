import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/kit/vite'
import sveltePreprocess from 'svelte-preprocess'
import dotenv from 'dotenv'

dotenv.config()

const removeTestIds = {
	name: 'RemoveTestIds',
	markup: ({ content }) => ({ code: content.replaceAll(/data-testid=".*"/g, '') }),
}

const preprocess = [vitePreprocess(), sveltePreprocess()]

if (process.env.ENVIRONMENT !== 'test') {
	preprocess.push(removeTestIds)
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess,
	kit: {
		adapter: adapter({
			envPrefix: '',
			out: 'build',
			precompress: false,
			polyfill: true,
		}),
		csrf: {
			checkOrigin: false,
		},
	},
	vitePlugin: {
		onwarn: (warning, handler) => {
			if (warning.code.includes('a11y-')) {
				return
			}
			handler(warning)
		},
	},
}

export default config

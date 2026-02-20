// import adapter from '@sveltejs/adapter-node'
import adapter from 'svelte-adapter-bun'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { sveltePreprocess } from 'svelte-preprocess'
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
			precompress: true,
		}),
		experimental: {
			remoteFunctions: true,
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
	compilerOptions: {
		experimental: {
			async: true,
		},
	},
}

export default config

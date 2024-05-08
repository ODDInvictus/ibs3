import { sveltekit } from '@sveltejs/kit/vite'
import type { Plugin, UserConfig } from 'vite'
import Icons from 'unplugin-icons/vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

const removeTestIdPlugin: Plugin = {
	name: 'remove-testids',
	enforce: 'pre',
	transform(code, id) {
		if (id.endsWith('.svelte')) {
			return code.replaceAll(/data-testid=".*"/g, '')
		}
		return code
	},
}

const config: UserConfig = {
	plugins: [
		sveltekit(),
		process.env.ENVIRONMENT === 'test' ? undefined : removeTestIdPlugin,
		Icons({
			compiler: 'svelte',
		}),
		SvelteKitPWA({
			strategies: 'generateSW',
			devOptions: {
				enabled: true,
			},
			workbox: {
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/c\.s-microsoft\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'microsoft-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
				],
			},
			manifest: {
				name: 'Invictus Bier Systeem',
				short_name: 'IBS',
				description: 'Invictus Bier Systeem is het websysteem voor alles Invictus',
				theme_color: '#551b8a',
				display: 'standalone',
				display_override: ['standalone', 'minimal-ui', 'fullscreen'],
				start_url: '/',
				launch_handler: {
					client_mode: 'navigate-new',
				},
				icons: [
					{
						src: '/favicon-192-maskable.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/favicon-768-maskable.png',
						sizes: '768x768',
						type: 'image/png',
					},
				],
			},
		}),
	],
}

export default config

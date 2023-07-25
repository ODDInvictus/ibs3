import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import Icons from 'unplugin-icons/vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

const config: UserConfig = {
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte',
		}),
		SvelteKitPWA({
			devOptions: {
				enabled: true
			},
			registerType: 'autoUpdate',
			manifest: {
				name: 'Invictus Bier Systeem',
				short_name: 'IBS',
				theme_color: '#551b8a',
				display: 'standalone',
				start_url: '/',
				icons: [
					{
						src: '/favicon-96.png',
						sizes: '96x96',
						type: 'image/png',
						purpose: 'any maskable',
					},
					{
						src: '/favicon-192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable',
					},
					{
						src: '/favicon-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
					},
				]
			}
		})
	]
};

export default config;

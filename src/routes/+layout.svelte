<script lang="ts">
	import { dev } from '$app/environment'
	import '../app.scss'
	import { pwaInfo } from 'virtual:pwa-info'
	import type { LayoutData } from './$types'

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : ''

	export let data: LayoutData
</script>

<svelte:head>
	{@html webManifestLink}
	<link rel="icon" type="image/x-icon" href={dev ? '/favicon-dev.png' : '/favicon.ico'} />
</svelte:head>

<div class="body ibs-theme--{data.theme}">
	<slot />
</div>

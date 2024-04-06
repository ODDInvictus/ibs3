<script lang="ts">
	import { page } from '$app/stores'
	import '../app.scss'
	import { pwaInfo } from 'virtual:pwa-info'

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : ''
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<div class="body ibs-theme--{$page.data.theme}">
	<slot />
</div>

<script lang="ts">
	import { page } from '$app/state'
	import '../app.scss'
	import { pwaInfo } from 'virtual:pwa-info'
	interface Props {
		children?: import('svelte').Snippet
	}

	let { children }: Props = $props()

	let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '')
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<div class="body ibs-theme--{page.data.theme}">
	{@render children?.()}
</div>

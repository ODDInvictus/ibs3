<script lang="ts">
	import type { PageData } from './$types'
	import Invoice from '../_invoice.svelte'
	import { onMount } from 'svelte'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	onMount(() => {
		window.document.close()
		window.focus()
		window.print()
		window.close()
	})
</script>

<svelte:head>
	<title>Invictus_factuur_{data.invoice.id}</title>
</svelte:head>

<Invoice invoice={data.invoice} />

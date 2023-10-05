<script lang="ts">
	import type { PageData } from './$types';
	import Invoice from './_invoice.svelte';
	import Title from '$lib/components/title.svelte';

	export let data: PageData;
</script>

<Title title={data.invoice.ref ?? 'Factuur'} />
<div class="info">
	<div class="print">
		<a href="/financieel/sales/{data.invoice.id}/print" class="button" target="_blank">Print/PDF</a>
		<p class="small">
			(zorg ervoor dat in je options print backgrounds aan staat en print headers and footers uit
			staat)
		</p>
	</div>
	<p>Referentie: {data.invoice.ref}</p>
	<p>Status: {data.invoice.bankTransaction ? 'Betaald' : 'Vestuurd'}</p>
</div>
<main>
	<Invoice invoice={data.invoice} />
</main>

<style>
	.info {
		margin-bottom: 1rem;
	}

	.small {
		font-size: small;
	}

	.print {
		margin-bottom: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	a {
		width: fit-content;
	}

	:global(#invoice) {
		transform-origin: top left;
		transform: scale(0.5);
	}
</style>

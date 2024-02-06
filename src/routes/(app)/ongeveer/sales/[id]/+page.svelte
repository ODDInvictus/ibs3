<script lang="ts">
	import type { PageData } from './$types';
	import Invoice from './_invoice.svelte';
	import Title from '$lib/components/title.svelte';
	import Pencil from '~icons/tabler/Pencil';
	import EditRef from './_editRef.svelte';
	import { openModal } from 'svelte-modals';

	export let data: PageData;
</script>

<Title title={data.invoice.ref || 'Factuur'} />
<div class="info">
	<div class="print">
		<a href="/ongeveer/sales/{data.invoice.id}/print" class="button" target="_blank">Print/PDF</a>
		<p class="small">
			(zorg ervoor dat in je printoptions print backgrounds aan staat, print headers and footers uit
			staat en je in light mode bent)
		</p>
	</div>
	<p>
		Referentie: {data.invoice.ref}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<i
			on:click={() =>
				openModal(EditRef, {
					form: data.form
				})}
		>
			<Pencil color="#777" class="pointer" />
		</i>
	</p>
	<!-- TODO: status -->
	<p>Status: Verstuurd</p>
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

	:global(.pointer) {
		cursor: pointer;
	}
</style>

<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import type { PageData } from './$types';
	import { formatDateHumanReadable } from '$lib/dateUtils';
	import { goto } from '$app/navigation';

	function formatPrice(price: number) {
		return price.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' });
	}

	export let data: PageData;
</script>

<!--
 TODO: Make responsive
-->

<div id="root">
	<Title
		title="Declaratie overzicht"
		shortTitle="Declaratie overzicht"
		underTitle="Hieronder staan alle declaraties die door jou zijn ingediend."
	/>

	<div class="buttons">
		<a href="/financieel/declaratie">Wil je een declaratie doen?</a>
	</div>

	<div class="table-wrapper">
		<table class="striped">
			<thead>
				<tr>
					<th>Prijs</th>
					<th>Datum</th>
					<th>Reden</th>
					<th>Betaalwijze</th>
				</tr>
			</thead>
			<tbody>
				{#if !data.declarations.length}
					<tr>
						<td colspan="7">
							<p id="no-decla">Geen declaraties gevonden</p>
							<a href="/financieel/declaratie" class="link">Wil je een declaratie doen?</a>
						</td>
					</tr>
				{/if}
				{#each data.declarations as declaration}
					<tr on:click={() => goto(`/financieel/declaratie/${declaration.id}`)}>
						<td class="price">{formatPrice(declaration.total)}</td>
						<td>{declaration.date ? formatDateHumanReadable(new Date(declaration.date)) : '?'}</td>
						<td>{declaration.description ?? '?'}</td>
						<td>{declaration.methodOfPayment ?? '?'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style lang="scss">
	.buttons {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	@media (max-width: 600px) {
		#root {
			overflow: hidden;
		}

		.table-wrapper {
			overflow-x: scroll;
		}

		table {
			width: 100%;
			overflow: scroll;
		}

		tr {
			height: 0;
		}

		td {
			height: 0;
		}
	}

	#no-decla {
		font-size: 1.1rem;
	}

	.link:hover {
		text-decoration: underline;
		cursor: pointer;
	}

	tr {
		cursor: pointer;
	}
</style>

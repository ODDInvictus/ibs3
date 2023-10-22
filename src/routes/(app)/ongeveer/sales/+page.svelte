<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';

	export let data: PageData;

	$: console.log(data.invoices);
</script>

<Title title="Verkoop overzicht" />
<main>
	<a href="/ongeveer/sales/create" class="button">Nieuwe facuur aanmaken</a>
	<table>
		<thead>
			<th>Factuur</th>
			<th>Relatie</th>
			<th>Totaal</th>
			<th>Status</th>
		</thead>
		<tbody>
			{#each data.invoices as invoice}
				<tr>
					<td>
						<a href="/ongeveer/sales/{invoice.id}">
							{invoice.id} - {invoice.ref}
						</a>
					</td>
					<td>
						<a href="/ongeveer/relations/{invoice.relationId}">
							{invoice.relationId} - {invoice.relation}
						</a>
					</td>
					<td>€ {invoice.total}</td>
					<td>
						{#if invoice.bankTransactionId}
							<a href="/ongeveer/bank/{invoice.bankTransactionId}">
								{invoice.bankTransactionId}
							</a>
						{:else if invoice.date}
							Verstuurd
						{:else}
							<a href="/ongeveer/sales/{invoice.id}/process">Verwerk</a>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		a {
			width: fit-content;
		}
	}
</style>

<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';

	export let data: PageData;
</script>

<Title title="Verkoop overzicht" />

<div class="ongeveer-nav">
	<a href="/ongeveer/sales/create">Nieuwe facuur aanmaken</a>
	<a href="/ongeveer/tallysheet/create">Steeplijst verwerken</a>
	<a href="/ongeveer/tallysheet">Streeplijst overzicht</a>
</div>

<main>
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
						<!-- TODO: Link naar banktransactie -->
						{#if invoice.date}
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

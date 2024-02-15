<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import { formatPrice } from '$lib/textUtils';
	import Pagination from '$lib/components/Pagination.svelte';

	export let data: PageData;
</script>

<Title title="Verkoop overzicht" />

<div class="ongeveer-nav">
	<a href="/ongeveer/sales/create">Nieuwe facuur aanmaken</a>
	<a href="/ongeveer/tallysheet/create">Steeplijst verwerken</a>
	<a href="/ongeveer/tallysheet">Streeplijst overzicht</a>
</div>

<table>
	<thead>
		<th>Factuur</th>
		<th>Relatie</th>
		<th>Totaal</th>
		<th>Status</th>
	</thead>
	<tbody>
		{#if data.invoices.length == 0}
			<td colspan="4">Geen verkopen gevonden</td>
		{/if}
		{#each data.invoices as { id, ref, relationId, relation, total, date }}
			<tr>
				<td>
					<a href="/ongeveer/sales/{id}">
						{ref ? `${id} - ${ref}` : id}
					</a>
				</td>
				<td>
					<a href="/ongeveer/relations/{relationId}">
						{relationId} - {relation.name}
					</a>
				</td>
				<td>{formatPrice(total)}</td>
				<td>
					<!-- Betaald status -->
					{#if date}
						Open
					{:else}
						Concept
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<Pagination p={data.p} size={data.size} url="/ongeveer/sales" />

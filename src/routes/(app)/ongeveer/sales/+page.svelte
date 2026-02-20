<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import { formatPrice } from '$lib/textUtils'
	import Pagination from '$lib/components/Pagination.svelte'
	import { formatDateHumanReadable } from '$lib/dateUtils'

	export let data: PageData
</script>

<Title title="Verkoop overzicht" />

<div class="ongeveer-nav">
	<a href="/ongeveer/sales/create">Nieuwe facuur aanmaken</a>
	<a href="/ongeveer/tallysheet/create">Steeplijst verwerken</a>
	<a href="/ongeveer/tallysheet">Streeplijst overzicht</a>
</div>

<table>
	<thead>
		<tr>
			<th>Factuur</th>
			<th>Relatie</th>
			<th>Verstuurdatum</th>
			<th>Totaal</th>
			<th>Status</th>
		</tr>
	</thead>
	<tbody>
		{#if data.invoices.length == 0}
			<td colspan="5">Geen verkopen gevonden</td>
		{/if}
		{#each data.invoices as { id, ref, relationId, relation, date, total, paid }}
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
				<td>{date ? formatDateHumanReadable(new Date(date)) : '-'}</td>
				<td>{formatPrice(total)}</td>
				<td>
					{#if total == paid}
						Betaald
					{:else if date}
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

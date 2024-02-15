<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import Title from '$lib/components/title.svelte';
	import { toDateString } from '$lib/dateUtils';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Title title="Inkoop" />

<div class="links">
	<a href="/ongeveer/purchases/create?type=INVOICE" class="button">Factuur inboeken</a>
	<a href="/ongeveer/purchases/create?type=DECLARATION" class="button">Declaratie inboeken</a>
</div>

<h2>Facturen</h2>
<table>
	<thead>
		<th>Boekstuknummer</th>
		<th>Type</th>
		<th>Referentie</th>
		<th>Bedrag</th>
		<th>Relatie</th>
		<th>Datum</th>
		<th>Status</th>
	</thead>
	<tbody>
		{#each data.journals as { id, ref, total, relationId, date, paid, type, relation }}
			<tr>
				<td><a href="/ongeveer/purchases/{id}">{id}</a></td>
				<td>{type.toLowerCase()}</td>
				<td>{ref ?? ''}</td>
				<td>€ {total}</td>
				<td><a href="/ongeveer/relations/{relationId}">{relationId} - {relation.name}</a></td>
				<td>{date ? toDateString(new Date(date)) : ''}</td>
				<td>{Number(paid) === Number(total) ? 'Betaald' : 'Open'}</td>
			</tr>
		{/each}
	</tbody>
</table>
<Pagination p={data.p} size={data.size} url="/ongeveer/purchases" />

<style lang="scss">
	.links {
		padding: 1rem 0;
		display: flex;
		gap: 1rem;
	}
</style>

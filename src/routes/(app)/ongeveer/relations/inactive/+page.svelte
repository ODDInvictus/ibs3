<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';

	export let data: PageData;
</script>

<Title title="Inactieve relaties" />

<table>
	<thead>
		<th>ID</th>
		<th>Naam</th>
		<th>Omschrijving</th>
	</thead>
	<tbody>
		{#if data.relations}
			{#each data.relations as relation}
				<tr>
					<td><a href="/ongeveer/relations/{relation.id}">{relation.id}</a></td>
					<td>{relation.name}</td>
					<td>{relation.FinancialPersonDataOther?.description}</td>
				</tr>
			{/each}
		{:else}
			<tr>
				<td colspan="3">Geen inactieve relaties gevonden</td>
			</tr>
		{/if}
	</tbody>
</table>

<a href="/ongeveer/relations">Actieve relaties</a>

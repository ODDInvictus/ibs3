<script lang="ts">
	import type { PageData } from './$types';
	import Table from '$lib/components/table.svelte';
	import Title from '$lib/components/title.svelte';

	export let data: PageData;
</script>

<Title title="Relaties" />
<table>
	<thead>
		<th>ID</th>
		<th>Naam</th>
		<th>Omschrijving</th>
	</thead>
	<tbody>
		{#each data.relations as relation}
			<tr>
				<td><a href="/financieel/relations/{relation.id}">{relation.id}</a></td>
				<td>{relation.name}</td>
				<td>{relation.FinancialPersonDataOther?.description}</td>
			</tr>
		{/each}
	</tbody>
</table>

<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import Plus from '~icons/tabler/plus';

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
		<tr>
			<td><a href="/financieel/relations/create"><Plus /></a></td>
			<td colspan="2" />
		</tr>
	</tbody>
</table>

<a href="/financieel/relations/inactive">Inactieve relaties</a>

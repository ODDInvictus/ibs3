<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import Plus from '~icons/tabler/plus'

	export let data: PageData
</script>

<Title title="Relaties" />

<div class="ongeveer-nav">
	<a href="/ongeveer/relations/create">Nieuwe relatie</a>
	<a href="/ongeveer/relations/inactive">Inactieve relaties</a>
</div>

<table>
	<thead>
		<th>Klantnummer</th>
		<th>Naam</th>
		<th>Omschrijving</th>
	</thead>
	<tbody data-testId="relations">
		{#each data.relations as relation}
			<tr>
				<td><a href="/ongeveer/relations/{relation.id}">{relation.id}</a></td>
				<td>{relation.name}</td>
				<td>{relation.FinancialPersonDataOther?.description ?? '-'}</td>
			</tr>
		{/each}
		<tr>
			<td><a href="/ongeveer/relations/create"><Plus /></a></td>
			<td colspan="2" />
		</tr>
	</tbody>
</table>

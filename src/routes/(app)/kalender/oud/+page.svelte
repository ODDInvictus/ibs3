<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Title title="Oude activiteiten" underTitle="Alle activiteiten die ooit geweest zijn" />

<table class="small striped">
	<thead>
		<tr>
			<th>ID</th>
			<th>Naam</th>
			<th>Datum</th>
			<th>Georganiseerd door</th>
			<th>Acties</th>
		</tr>
	</thead>
	<tbody>
		{#each data.activities as activity}
			<tr>
				<td>{activity.id}</td>
				<td>{activity.name}</td>
				<td>{activity.createdAt.toLocaleDateString('nl')}</td>
				<td>{activity.organisedBy.name}</td>
				<td>
					<a href="/activiteit/{activity.id}">Bekijk</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

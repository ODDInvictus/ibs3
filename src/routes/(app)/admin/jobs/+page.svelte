<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Title title="Jobs" underTitle="Overzicht van alle jobs in de database" />

<table class="striped">
	<thead>
		<tr>
			<th>Naam</th>
			<th>Aangemaakt</th>
			<th>Voltooid</th>
			<th>Meer</th>
		</tr>
	</thead>
	<tbody>
		{#each data.jobs as job}
			<tr>
				<td>{job.name}</td>
				<td>{job.createdAt.toLocaleString('nl')}</td>
				<td>{job.finished ? 'Ja' : 'Nee'}</td>
				<td><a href="/admin/jobs/{job.name}">Meer informatie</a></td>
			</tr>
		{/each}
	</tbody>
</table>

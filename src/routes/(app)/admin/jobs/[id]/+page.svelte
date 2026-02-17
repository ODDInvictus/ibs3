<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Title title={data.job.name} underTitle="Hier zie je meer informatie over deze job" />

<table class="striped equal-width">
	<tbody>
		<tr>
			<td>Naam</td>
			<td>{data.job.name}</td>
		</tr>

		<tr>
			<td>Data</td>
			<td>{data.job.data}</td>
		</tr>

		<tr>
			<td>Type</td>
			<td>{data.job.type}</td>
		</tr>

		<tr>
			<td>Voltooid</td>
			<td>{data.job.finished ? 'Ja' : 'Nee'}</td>
		</tr>

		<tr>
			<td>Voltooid op</td>
			<td>{data.job.completedAt?.toLocaleString('nl')}</td>
		</tr>

		<tr>
			<td>Resultaat</td>
			<td>{data.job.result ?? 'Geen resultaat opgeslagen'}</td>
		</tr>

		<tr>
			<td>Aangemaakt op</td>
			<td>{data.job.createdAt.toLocaleString('nl')}</td>
		</tr>

		<tr>
			<td>Laatst geupdate op</td>
			<td>{data.job.updatedAt.toLocaleString('nl')}</td>
		</tr>
	</tbody>
</table>

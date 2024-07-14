<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Title title="Oude ranglijsten" />

<table class="striped">
	<thead>
		<tr>
			<th>Naam</th>
			<th>Beschrijving</th>
			<th>Type</th>
			<th>Geopent op</th>
			<th>Gesloten op</th>
			<th>Aangemaakt op</th>
		</tr>
	</thead>

	<tbody>
		{#each data.leaderboards as leaderboard}
			<tr>
				<td>
					<a href="/ranglijst/{leaderboard.id}">
						{leaderboard.name}
					</a>
				</td>
				<td>{leaderboard.description}</td>
				<td>{leaderboard.type}</td>

				<td>
					{leaderboard.opensAt?.toLocaleString('nl') ?? '-'}
				</td>

				<td>
					{leaderboard.closesAt?.toLocaleString('nl') ?? '-'}
				</td>

				<td>
					{leaderboard.createdAt.toLocaleString('nl')}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

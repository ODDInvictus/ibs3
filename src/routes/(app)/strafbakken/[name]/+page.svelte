<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { markdown } from '$lib/utils'
	import type { sbUserPageData } from '../types'

	export let data: sbUserPageData

	const formatName = (names: { nickname: string | null; firstName: string }) => {
		let unformattedName = names.nickname || names.firstName
		return unformattedName[0].toUpperCase() + unformattedName.slice(1).toLowerCase()
	}

	$: name = formatName({
		nickname: data.strafbakken.nickname,
		firstName: data.strafbakken.firstName,
	})
</script>

<main>
	<Title title="{name} zijn {data.strafbakken.StrafbakReceived.length} strafbakken" shortTitle="{name} - Strafbakken" />
	<div class="table-container">
		<table class="striped">
			<thead>
				<th>Gever</th>
				<th>Reden</th>
				<th>Datum</th>
				<th>Tijd</th>
			</thead>
			<tbody>
				{#each data.strafbakken.StrafbakReceived as strafbak}
					<tr>
						<td>
							{#if strafbak.giver}
								<a href={`/strafbakken/${strafbak.giver.firstName}`}>
									{formatName(strafbak.giver)}
								</a>
							{:else}
								IBS
							{/if}
						</td>
						<td>{@html markdown(strafbak.reason) ?? 'Geen reden gegeven'}</td>
						<td>{strafbak.dateCreated.toLocaleDateString()}</td>
						<td>{strafbak.dateCreated.toLocaleTimeString().slice(0, -3)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>

<style>
	.table-container {
		overflow: auto;
	}
</style>

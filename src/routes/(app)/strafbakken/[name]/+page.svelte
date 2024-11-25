<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { markdown } from '$lib/utils'
	import type { PageData } from './$types'

	export let data: PageData

	let name = data.strafbakken.nickname ?? data.strafbakken.firstName
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
									{strafbak.giver.nickname ?? strafbak.giver.firstName}
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

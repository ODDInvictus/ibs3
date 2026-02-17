<script lang="ts">
	import { page } from '$app/state'
	import Title from '$lib/components/title.svelte'
	let locations = page.data.locations
</script>

<Title title="Locaties" />

<div class="center">
	<table class="striped small not-full-width">
		<thead>
			<tr>
				<th>Locatie</th>
				<th>ID</th>
			</tr>
		</thead>
		<tbody>
			{#each locations as l}
				<tr>
					<td><a href="/locatie/{l.id}">{l.name}</a></td>
					<td>{l.id}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

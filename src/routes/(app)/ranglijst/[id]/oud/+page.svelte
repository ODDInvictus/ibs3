<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	function calcTime(num: number) {
		const minutes = num / 60
		const seconds = num % 60

		if (minutes < 1) return `00:${seconds < 10 ? '0' : ''}${seconds}`
		return `${Math.floor(minutes)}:${seconds < 10 ? '0' : ''}${seconds}`
	}
</script>

<Title title="Oude inzendingen" />

<table class="small striped equal-width">
	<thead>
		<tr>
			<th>Naam</th>
			<th>Waarde</th>
			<th>Wanneer</th>
		</tr>
	</thead>

	<tbody>
		{#each data.entries as submission}
			<tr>
				<td>{submission.user.firstName}</td>
				{#if data.leaderboard.type === 'TIME'}
					<td>{calcTime(submission.value)}</td>
				{:else}
					<td>{submission.value}</td>
				{/if}
				<td>{submission.createdAt.toLocaleString('nl')}</td>
			</tr>
		{/each}
	</tbody>
</table>

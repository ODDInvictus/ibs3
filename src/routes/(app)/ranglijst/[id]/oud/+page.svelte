<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import { calcLeaderboardTime } from '$lib/leaderboards'
	import type { PageData } from './$types'

	export let data: PageData

	function back() {
		window.history.back()
	}
</script>

<Title title="Oude inzendingen" />

<div class="topbar">
	<button class="btn-a" on:click={back}> Terug </button>
</div>

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
				{#if data.leaderboard.type === 'TIME' || data.leaderboard.type === 'ADTMEISTER'}
					<td>{calcLeaderboardTime(submission.value, data.leaderboard.type)}</td>
				{:else}
					<td>{submission.value}</td>
				{/if}
				<td>{submission.createdAt.toLocaleString('nl')}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.topbar {
		display: flex;
		justify-content: center;
	}
</style>

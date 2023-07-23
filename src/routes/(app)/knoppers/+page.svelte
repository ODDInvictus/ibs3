<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let width: number;
</script>

<svelte:window bind:innerWidth={width} />

<Title title="Knoppers klikker" />

<table>
	<col /><col /><col id="clicks" /><col />
	<thead>
		<th>Positie</th>
		<th>Naam</th>
		<th>Minuten</th>
		<th>Clicks</th>
	</thead>
	<tbody>
		{#each data.leaderboard as user, i}
			<tr>
				<td>{i + 1}</td>
				<td>{user.nickName ?? user.firstName}</td>
				<td>{data.playTime[user.id] || '<1'}</td>
				<td>
					{user.amount}
					{#if data.lastUpdates[user.id] && width > 375}
						<span class="new">+{data.lastUpdates[user.id]}</span>
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	table {
		width: fit-content;
		margin-left: auto;
		margin-right: auto;

		col {
			width: fit-content;
		}

		td {
			position: relative;

			@media (min-width: 700px) {
				padding-left: 1.5rem;
				padding-right: 1.5rem;
			}

			.new {
				position: absolute;
				right: -2rem;
				top: 10px;
				color: green;
				font-size: smaller;
			}
		}
	}
</style>

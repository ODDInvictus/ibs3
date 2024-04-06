<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { bakkenPageData } from '../types'
	import Table from './Table.svelte'

	export let data: bakkenPageData

	const middleIndex = Math.ceil(data.strafbakken.length / 2)
	let width: number

	// Get the longest name
	let longestName = ''
	data.strafbakken.forEach(user => {
		let name = user.nickname ?? user.firstName
		if (name.length > longestName.length) longestName = name
	})

	function getTitle(week: String | null) {
		if (week === null) return 'Alle getrokken strafbakken'
		if (week === '0') return 'Getrokken strafbakken deze week'
		return `Getrokken strafbakken week ${week}`
	}

	$: msg = getTitle(data.week)
</script>

<svelte:window bind:innerWidth={width} />

<Title title={msg} shortTitle="Leaderboard - Strafbakken" />

<div class="root">
	<table-container>
		{#if width < 900 || data.strafbakken.length < 5}
			<Table data={data.strafbakken} longestName={null} />
		{:else}
			<Table data={data.strafbakken.slice().splice(0, middleIndex)} {longestName} />
			<Table data={data.strafbakken.slice().splice(middleIndex, data.strafbakken.length - 1)} {longestName} />
		{/if}
	</table-container>
	{#if data.week !== '0'}
		<div class="link">
			<a href="/strafbakken/bakken?week=0" class="button" data-sveltekit-preload-data="hover"> Wie is er deze week meesterbakker? </a>
		</div>
	{/if}
	<div class="link">
		<a href={data.week === null ? '/strafbakken' : '/strafbakken/bakken'} class="button" data-sveltekit-preload-data="hover"> Terug </a>
	</div>
</div>

<style lang="scss">
	$margin: 1rem;
	$cell-padding: 0.75rem;

	.link {
		margin-top: 1rem;
	}

	.root {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: $margin;

		table-container {
			width: 100%;
			display: flex;
			justify-content: center;
			gap: $margin;
		}

		a {
			width: fit-content;
		}
	}
</style>

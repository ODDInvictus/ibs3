<script lang="ts">
	import { Modals, closeModal } from 'svelte-modals';
	import Table from './Table.svelte';
	import type { sbPageData } from './types';
	import Title from '$lib/components/title.svelte';

	export let data: sbPageData;

	const middleIndex = Math.ceil(data.strafbakken.length / 2);
	let width: number;

	// Get the longest name
	let longestName = '';
	data.strafbakken.forEach((user) => {
		let name = user.nickname ?? user.firstName;
		if (name.length > longestName.length) longestName = name;
	});
</script>

<svelte:window bind:innerWidth={width} />

<Title title="Strafbakken" />

<main>
	<Modals>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div slot="backdrop" class="backdrop" on:click={closeModal} />
	</Modals>

	<div class="table-container">
		{#if width < 900}
			<Table data={data.strafbakken} longestName={null} />
		{:else}
			<Table data={data.strafbakken.slice().splice(0, middleIndex)} {longestName} />
			<Table
				data={data.strafbakken.slice().splice(middleIndex, data.strafbakken.length - 1)}
				{longestName}
			/>
		{/if}
	</div>
	<div class="link">
		<a href="/strafbakken/bakken" class="button" data-sveltekit-preload-data="hover">
			Hoeveel heeft iedereen al getrokken?
		</a>
	</div>
</main>

<style lang="scss">
	$margin: 1rem;

	main {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: $margin;

		.table-container {
			width: 100%;
			display: flex;
			justify-content: center;
			gap: $margin;
		}
	}

	.link {
		margin-top: 1rem;
	}

	.backdrop {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 1;
	}
</style>

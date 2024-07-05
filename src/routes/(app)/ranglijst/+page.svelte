<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'
	import Pin from '~icons/tabler/pin'

	export let data: PageData
</script>

<Title title="Ranglijsten" shortTitle="Ranglijsten" />

<div class="topbar">
	<a class="link" href="/ranglijst/oud">Zie verlopen lijsten</a>
</div>

{#each data.leaderboards as leaderboard}
	<p>
		<a href="/ranglijst/{leaderboard.id}">
			{leaderboard.name}
			{#if leaderboard.pinned}
				<div>
					<Pin />
				</div>
			{/if}
		</a>
	</p>
{/each}

<style>
	p {
		color: var(--color-primary);
	}

	div {
		display: inline-block;
		vertical-align: -0.125em;
	}

	.topbar {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>

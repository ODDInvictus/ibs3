<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';

	export let data: PageData;
</script>

<Title title="Pasen" />
<main>
	<h3>Er zijn over de hele website paaseieren verstopt. Vind ze allemaal!</h3>
	<div class="eggs">
		{#each data.eggs as egg}
			{#if [...egg.found.data][Math.round((data.user.id - 1) / 8)] & (1 << (data.user.id - 1) % 8)}
				<a href={`/pasen/${egg.name}`}>
					<div class="egg">
						<img src={`/image/eggs/${egg.img}?static=true`} alt={egg.name} />
						<p>{egg.name}</p>
					</div>
				</a>
			{:else}
				<div class="egg">
					<img src="/image/eggs/undiscovered.png?static=true" alt="undiscovered" />
					<p>???</p>
				</div>
			{/if}
		{/each}
	</div>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		align-items: center;

		.eggs {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr 1fr;
			gap: 30px;
			padding: 30px;

			.egg {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 5px;
			}

			img {
				height: 75px;
			}
		}
	}
</style>

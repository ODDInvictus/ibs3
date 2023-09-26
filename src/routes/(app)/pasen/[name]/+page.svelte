<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import UserCard from '$lib/components/user-card.svelte';

	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<Title title={data.egg.name} />

<main>
	<div class="left">
		<img src={`/eggs/${data.egg.img}`} alt={data.egg.name} />
	</div>

	<div class="right">
		<h1>Gevonden door</h1>
		<div class="users">
			{#each data.users as user}
				<UserCard {user} />
			{/each}
		</div>
	</div>
</main>

<style lang="scss">
	$margin: 1rem;

	main {
		display: flex;
		justify-content: center;
		gap: calc(2 * $margin);
		padding: calc(2 * $margin);

		.right {
			display: flex;
			flex-direction: column;
			gap: $margin;
		}

		.users {
			display: grid;
			grid-template-rows: 1fr;
			gap: $margin;
		}
	}
</style>

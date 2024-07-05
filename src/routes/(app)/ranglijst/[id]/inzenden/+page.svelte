<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Title title="Inzending doen voor {data.leaderboard.name}" shortTitle="Inzending doen" />

<form method="POST">
	<label for="user">Wie was het?</label>
	<select name="user" value={data.user.id}>
		{#each data.users as u}
			<option value={u.id}>{u.firstName}</option>
		{/each}
	</select>

	<label for="value">Waarde</label>
	{#if data.leaderboard.type === 'TIME'}
		<input type="time" name="value" />
	{:else}
		<input type="number" name="value" />
	{/if}

	<button type="submit">Inzenden</button>
</form>

<style lang="scss">
	form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
</style>

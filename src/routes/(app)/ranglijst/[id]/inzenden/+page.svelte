<script lang="ts">
	import { enhance } from '$app/forms'
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	let dnf = false

	function onDNFChange(event) {
		dnf = event.target.checked
	}
</script>

<Title title="Inzending doen voor {data.leaderboard.name}" shortTitle="Inzending doen" />

<form method="POST">
	<label for="user">Wie was het?</label>
	<select name="user" value={data.user.id}>
		{#each data.users as u}
			<option value={u.id}>{u.firstName}</option>
		{/each}
	</select>

	{#if data.type === 'TIME'}
		<label for="value">Tijd</label>
		<input disabled={dnf} type="time" name="value" />
		<label for="dnf">DNF</label>
		<input type="checkbox" name="dnf" on:change={onDNFChange} />
	{:else if data.type === 'ADTMEISTER'}
		<label for="value">Tijd (s:ms)</label>
		<div class="adtmeister-input">
			<input type="number" name="s" value={0} disabled={dnf} />
			<input type="number" name="ms" value={0} min={0} max={99} disabled={dnf} />
		</div>

		<label for="dnf">DNF</label>
		<input type="checkbox" name="dnf" on:change={onDNFChange} />
	{:else}
		<label for="value">Waarde</label>
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

	.adtmeister-input {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
</style>

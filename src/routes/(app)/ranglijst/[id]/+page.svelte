<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import { LDAP_IDS } from '$lib/constants'
	import { toast } from '$lib/notification'
	import { calcLeaderboardTime, getLeaderboardName } from '$lib/leaderboards'

	export let data: PageData

	let currentDate = new Date()

	function formatDate(date: Date) {
		return date.toLocaleDateString('nl')
	}

	async function pin() {
		await fetch('', {
			method: 'POST',
		}).then(async res => {
			const txt = await res.text()

			if (res.status === 200) {
				toast({ title: 'Success', message: txt, type: 'success' })
			} else {
				toast({ title: 'Error', message: txt, type: 'danger' })
			}
		})
	}
</script>

<Title markdown title={data.scoreboard.name} shortTitle={data.scoreboard.name} underTitle={data.scoreboard.description} />

<div class="topbar">
	{#if data.canSubmit}
		<a class="link" href="/ranglijst/{data.scoreboard.id}/inzenden">Nieuwe inzending</a>
	{/if}

	<a class="link" href="/ranglijst/{data.scoreboard.id}/oud">Oude inzendingen</a>

	{#if data.roles[LDAP_IDS.ADMINS]}
		<button class="btn-a" on:click={pin}>Lijst {data.scoreboard.pinned ? 'losmaken' : 'vastzetten'}</button>
		&nbsp;&nbsp;&nbsp;
	{/if}

	{#if data.scoreboard.opensAt && data.scoreboard.opensAt > currentDate}
		<p>Ranglijst is nog niet geopend, je kan nog geen inzendingen doen.</p>
	{/if}

	{#if data.scoreboard.closesAt && currentDate > data.scoreboard.closesAt}
		<p>Ranglijst is gesloten, je kan geen inzendingen meer doen.</p>
	{/if}

	{#if data.scoreboard.opensAt && data.scoreboard.opensAt < currentDate && data.scoreboard.closesAt && currentDate <= data.scoreboard.closesAt}
		<p>Je kan nog inzenden tot {formatDate(data.scoreboard.closesAt)}.</p>
	{/if}
</div>

<table class="small equal-width striped">
	<thead>
		<tr>
			<th>Positie</th>
			<th>Naam</th>
			<th>{getLeaderboardName(data.scoreboard.type)}</th>
		</tr>
	</thead>
	<tbody>
		{#each data.entries as entry, i}
			<tr>
				<td>{i + 1}</td>
				<td>{entry.name}</td>
				{#if data.scoreboard.type === 'TIME' || data.scoreboard.type === 'ADTMEISTER'}
					<td>{calcLeaderboardTime(entry.value, data.scoreboard.type)}</td>
				{:else}
					<td>{entry.value}</td>
				{/if}
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	.topbar {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	@media (max-width: 640px) {
		.topbar {
			flex-direction: column;
			align-items: center;
		}
	}

	.link {
		margin-right: 1rem;
	}
</style>

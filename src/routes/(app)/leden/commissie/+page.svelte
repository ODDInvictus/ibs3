<script lang="ts">
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';
	import Check from '~icons/tabler/check';
	import Cross from '~icons/tabler/letter-x';
	let committees = $page.data.committees;
	let count = $page.data.count;
</script>

<Title title="Commissies" />

<table class="striped">
	<thead>
		<tr>
			<th>Naam</th>
			<th>ldapID</th>
			<th>Aantal leden</th>
			<th>Is actief</th>
		</tr>
	</thead>
	<tbody>
		{#each committees as c}
			<tr>
				<td>{c.name}</td>
				<td><a href="/leden/commissie/{c.ldapId}">{c.ldapId}</a></td>
				<td>{count.find((cc) => cc.committeeId === c.id)?._count.committeeId ?? 0}</td>
				<td>
					{#if c.isActive}
						<Check />
					{:else}
						<Cross />
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

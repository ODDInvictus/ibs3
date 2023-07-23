<script lang="ts">
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';
	import { formatPrice } from '$lib/textUtils';

	const personId = $page.data.own.personId;
</script>

<Title title="Saldo overzicht" />

<table>
	<thead>
		<tr>
			<th>Naam</th>
			<th>Saldo</th>
		</tr>
	</thead>
	{#each $page.data.persons as person}
		<tr class={personId === person.personId ? 'person-self' : 'person-other'}>
			<td>{person.person.name}</td>
			<td class="euro">{formatPrice(person.person.balance)}</td>
		</tr>
	{/each}
</table>

<style lang="scss">
	.person-self {
		background-color: purple;
		color: white;
	}
</style>

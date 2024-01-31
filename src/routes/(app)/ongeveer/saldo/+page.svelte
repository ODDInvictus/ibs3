<script lang="ts">
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';
	import { formatPrice } from '$lib/textUtils';

	const personId = $page.data.own.personId;
</script>

<Title title="Saldo overzicht" />

<a href="/ongeveer/saldo/transaction" class="button">Transactie maken</a>

<table class="small">
	<thead>
		<tr>
			<th>Naam</th>
			<th>Saldo</th>
		</tr>
	</thead>
	{#each $page.data.persons as person}
		<tr class={personId === person.personId ? 'highlight' : null}>
			<td>{person.person.name}</td>
			<td class="euro">{formatPrice(person.person.balance)}</td>
		</tr>
	{/each}
</table>

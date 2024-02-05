<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { formatPrice } from '$lib/textUtils';
	import type { PageData } from './$types';

	export let data: PageData;

	const personId = data.own?.personId;
</script>

<Title title="Saldo overzicht" />

<div class="ongeveer-nav">
	<a href="/ongeveer/saldo/transactions/create">Transactie maken</a>
	<a href="/ongeveer/saldo/transactions">Transacties overzicht</a>
</div>

<table class="small">
	<thead>
		<tr>
			<th>Naam</th>
			<th>Saldo</th>
		</tr>
	</thead>
	{#each data.persons as person}
		<tr class={personId === person.personId ? 'highlight' : null}>
			<td>{person.person.name}</td>
			<td class="euro">{formatPrice(person.person.balance)}</td>
		</tr>
	{/each}
</table>

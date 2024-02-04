<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { formatPrice } from '$lib/textUtils';
	import type { PageData } from './$types';

	export let data: PageData;

	const personId = data.own?.personId;
</script>

<Title title="Saldo overzicht" />

<div id="buttons">
	<a href="/ongeveer/saldo/transactions/create" class="button">Transactie maken</a>
	<a href="/ongeveer/saldo/transactions" class="button">Transacties overzicht</a>
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

<style lang="scss">
	#buttons {
		padding: 2rem 1rem;

		a {
			margin-right: 1rem;
		}
	}
</style>

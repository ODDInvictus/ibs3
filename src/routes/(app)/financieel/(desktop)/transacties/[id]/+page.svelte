<script lang="ts">
	import type { PageData } from './$types';

	import Title from '$lib/components/title.svelte';
	import { formatDateTimeHumanReadable } from '$lib/dateUtils';

	export let data: PageData;
</script>

<Title title={data.transaction ? 'Transactie' : 'Niet gevonden'} />
{#if data.transaction}
	<p>ID: {data.transaction.id}</p>
	<p>Van: {data.transaction.from.name}</p>
	<p>Naar: {data.transaction.to.name}</p>
	<p>Prijs: {data.transaction.price}</p>
	<p>Omschrijving: {data.transaction.description}</p>
	<p>Datum: {formatDateTimeHumanReadable(data.transaction.createdAt)}</p>
	{#if data.transaction.ledger}
		<p>
			Ledger: <a href="/ongeveer/ledger/{data.transaction.ledgerId}"
				>{data.transaction.ledger.id} - {data.transaction.ledger.name}</a
			>
		</p>
	{:else}
		<p>Ledger: <i>Geen</i></p>
	{/if}
{/if}

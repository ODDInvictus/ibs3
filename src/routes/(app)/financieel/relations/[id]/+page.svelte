<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';

	export let data: PageData;
</script>

<Title title="Relaties" />
{#if data.relation}
	<p>ID: {data.relation.id}</p>
	<p>Naam: {data.relation.name}</p>
	<p>Omschrijving: {data.relation.FinancialPersonDataOther?.description}</p>
	<p>IBAN: {data.relation.FinancialPersonDataOther?.iban ?? 'Onbekend'}</p>
	<p>Adres: {data.relation.FinancialPersonDataOther?.address}</p>
{/if}

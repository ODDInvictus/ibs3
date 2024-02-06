<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { formatPrice } from '$lib/textUtils';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Title title="Financieel" />

{#if !data.person}
	<p class="text-red-500">
		Oei! Er is nog geen financiele data voor jou aangemaakt. Kijk over een uurtje hier weer terug.
		Werkt het dan nog niet? Stuur dan even een mailtje naar bakkentrekkers@oddinvictus.nl
	</p>
{:else}
	<p>
		Huidig saldo:
		<span class={data.person.balance < 0 ? 'red' : ''}>
			{formatPrice(data.person.balance)}
		</span>
	</p>
{/if}

<p>Je hebt de volgende opties:</p>

<a href="/financieel/declaratie/overzicht">Declaratie overzicht</a>
{#if data.person}
	<a href="/financieel/streeplijst/verwerk">Verwerk streeplijst</a>
	<a href="/financieel/declaratie">Doe een declaratie</a>
{/if}

<style lang="scss">
	a {
		margin: 1rem 0;
		display: block;
		width: fit-content;
	}

	.red {
		color: rgb(146, 0, 0);
	}

	:global(.ibs-theme--dark) .red {
		color: red;
	}
</style>

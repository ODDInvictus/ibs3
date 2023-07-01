<script lang="ts">
	import { page } from '$app/stores';

	function formatPrice(price: number) {
		let color = '';
		if (price > 20) {
			color = 'text-green-500';
		} else if (price < 0) {
			color = 'text-red-500';
		}

		return `<span class=${color}>${price.toLocaleString('nl-NL', {
			style: 'currency',
			currency: 'EUR'
		})}</span>`;
	}
</script>

<h1>Financieel</h1>

<hr />

{#if !$page.data.person}
	<p class="text-red-500">
		Oei! Er is nog geen financiele data voor jou aangemaakt. Kijk over een uurtje hier weer terug.
		Werkt het dan nog niet? Stuur dan even een mailtje naar bakkentrekkers@oddinvictus.nl
	</p>
{:else}
	<p>Huidig saldo: {@html formatPrice($page.data.person.balance)}</p>
{/if}

<p>Je hebt de volgende opties:</p>

<a href="/financieel/transacties/">Transacties</a>
<a href="/financieel/declaratie/overzicht">Declaratie overzicht</a>
<a href="/financieel/transacties/verkopen">Verkoop overzicht</a>
{#if $page.data.person}
	<a href="/financieel/saldo">Saldo overzicht</a>
	<a href="/financieel/streeplijst/verwerk">Verwerk streeplijst</a>
	<a href="/financieel/declaratie">Doe een declaratie</a>
	<a href="/financieel/transacties/nieuw">Maak handmatig een transactie</a>
{/if}

<style>
	a {
		margin: 1rem 0;
		display: block;
		width: fit-content;
	}

	h1 {
		text-align: center;
	}

	hr {
		margin: var(--hr-margin);
	}
</style>

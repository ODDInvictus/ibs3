<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import { formatPrice } from '$lib/textUtils';
	import { formatDateHumanReadable } from '$lib/dateUtils';

	export let data: PageData;
</script>

<Title title="Aankoop" />
<div class="top">
	<div>
		<h3>Gegevens</h3>
		<div class="info">
			<div>
				<p>Referentie:</p>
				<p>Omschrijving:</p>
				<p>Betalingstermijn:</p>
				<p>Boekstuknummer:</p>
				<p>Ingeboekt: door:</p>
				<p>Datum:</p>
			</div>
			<div>
				<p>{data.purchase.ref ?? '-'}</p>
				<p>{data.purchase.description ?? '-'}</p>
				<p>{data.purchase.id}</p>
				<p>{data.purchase.termsOfPayment} dagen</p>
				<p>{data.purchase.Treasurer?.firstName ?? '-'}</p>
				<p>{data.purchase.date ? formatDateHumanReadable(data.purchase.date) : '-'}</p>
			</div>
		</div>
	</div>
	<div class="attachments">
		{#if data.attachments.length > 0}
			<h3>Bijlagen</h3>
			{#each data.attachments as attachment}
				<a href={attachment.src} target="_blank">{attachment.name}</a>
			{/each}
		{:else}
			<p><i>Geen bijlagen</i></p>
		{/if}
	</div>
</div>
<table class="striped">
	<thead>
		<th>Omschrijving</th>
		<th>Grootboek</th>
		<th>Hoeveelheid</th>
		<th>Prijs</th>
		<th>Totaal</th>
	</thead>
	<tbody>
		{#each data.purchase.Rows as row}
			<tr>
				<td>{row.description}</td>
				<td><a href="/ongeveer/ledger/{row.ledgerId}">{row.ledgerId} - {row.Ledger.name}</a></td>
				<td>{row.amount}</td>
				<td>{formatPrice(row.price)}</td>
				<td>{formatPrice(row.total)}</td>
			</tr>
		{/each}
		<tr>
			<td /><td /><td /><td><i>Totaal</i></td><td>{formatPrice(data.purchase.total)}</td>
		</tr>
	</tbody>
</table>

<div class="actions">
	<a class="button" href="/ongeveer/purchases/create?id={data.purchase.id}">Bewerken</a>
</div>

<style lang="scss">
	.top {
		display: flex;
		gap: 2rem;

		.info {
			display: grid;
			grid-template-columns: 1fr 1fr;
			width: fit-content;
		}
	}

	.actions {
		margin-top: 2rem;
	}

	h3,
	table {
		margin: 0.5rem 0;
	}

	.button:hover {
		text-decoration: underline;
	}
</style>

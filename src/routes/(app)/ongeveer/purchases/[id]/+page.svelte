<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import { formatPrice } from '$lib/textUtils'
	import { formatDateHumanReadable } from '$lib/dateUtils'

	export let data: PageData
</script>

<Title title="Aankoop" />

<div class="top">
	<div>
		<h3>Gegevens</h3>
		<!-- TODO use table -->
		<div class="info">
			<div>
				<p>Referentie:</p>
				<p>Omschrijving:</p>
				<p>Betalingstermijn:</p>
				<p>Boekstuknummer:</p>
				<p>Ingeboekt door:</p>
				<p>Datum:</p>
				<p>Type:</p>
			</div>
			<div>
				<p>{data.purchase.ref ?? '-'}</p>
				<p>{data.purchase.description ?? '-'}</p>
				<p>{data.purchase.termsOfPayment} dagen</p>
				<p>{data.purchase.id}</p>
				<p>{data.purchase.Treasurer?.firstName ?? '-'}</p>
				<p>{data.purchase.date ? formatDateHumanReadable(new Date(data.purchase.date)) : '-'}</p>
				<p>{data.purchase.type.toLocaleLowerCase()}</p>
			</div>
		</div>
	</div>

	<div>
		<h3>Declaratie</h3>
		<div class="info">
			<div>
				<p>Titel:</p>
			</div>
			<div>
				<p>huts</p>
			</div>
		</div>
	</div>
	<div class="attachments">
		{#if data.attachments.length > 0}
			<h3>Bijlagen</h3>
			<ul>
				{#each data.attachments as { src, filename }}
					<li>
						<a href={src} target="_blank">{filename}</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p><i>Geen bijlagen</i></p>
		{/if}
	</div>
</div>

<h2>Uitgesplitst</h2>
<table class="striped">
	<thead>
		<th>Omschrijving</th>
		<th>Grootboek</th>
		<th>Hoeveelheid</th>
		<th>Prijs</th>
		<th>Totaal</th>
	</thead>
	<tbody>
		{#each data.rows as row}
			<tr>
				<td>{row.description}</td>
				<td><a href="/ongeveer/ledger/{row.ledgerId}">{row.ledgerId} - {row.Ledger.name}</a></td>
				<td>{row.amount}</td>
				<td>{formatPrice(row.price)}</td>
				<td>{formatPrice(row.total)}</td>
			</tr>
		{/each}
		<tr>
			<td colspan="3" />
			<td><i>Totaal</i></td>
			<td>{formatPrice(data.total)}</td>
		</tr>
	</tbody>
</table>

<div class="actions">
	<a class="button" href="/ongeveer/purchases/create?id={data.purchase.id}">Bewerken</a>
</div>

<h2>Gematchte transacties</h2>
<table class="striped">
	<thead>
		<th>Omschrijving</th>
		<th>Transactie</th>
		<th>Type</th>
		<th>Bedrag</th>
	</thead>
	<tbody>
		{#if data.purchase.TransactionMatchRow.length === 0}
			<tr>
				<td colspan="4">Nog niks gematcht</td>
			</tr>
		{/if}
		{#each data.purchase.TransactionMatchRow as { amount, description, Transaction }}
			<tr>
				<td>{description || '-'}</td>
				<td><a href="/ongeveer/transaction/{Transaction.id}">#{Transaction.id}</a></td>
				<td>{Transaction.type === 'BANK' ? 'Bank' : 'Saldo'}</td>
				<td>{formatPrice(amount)}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	.top {
		display: flex;
		gap: 2rem;

		.info {
			display: grid;
			width: fit-content;
			gap: 1rem;
			grid-template-columns: 1fr 1fr;
		}
	}

	.actions {
		margin: 2rem 0;
	}

	h2 {
		margin-top: 1rem;
	}

	.button:hover {
		text-decoration: underline;
	}
</style>

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
		<table>
			<tbody>
				<tr>
					<th>Referentie</th>
					<td>{data.purchase.ref ?? '-'}</td>
				</tr>
				<tr>
					<th>Omschrijving</th>
					<td>{data.purchase.description ?? '-'}</td>
				</tr>
				<tr>
					<th>Betalingstermijn</th>
					<td>{data.purchase.termsOfPayment} dagen</td>
				</tr>
				<tr>
					<th>Boekstuknummer</th>
					<td>{data.purchase.id}</td>
				</tr>
				<tr>
					<th>Datum</th>
					<td>{data.purchase.date ? formatDateHumanReadable(new Date(data.purchase.date)) : '-'}</td>
				</tr>
				<tr>
					<th>Bedrag</th>
					<td>{formatPrice(data.total)}</td>
				</tr>
				<tr>
					<th>Type</th>
					<td>{data.purchase.type.toLocaleLowerCase()}</td>
				</tr>
			</tbody>
		</table>
	</div>

	{#if data.purchase.DeclarationData}
		<div>
			<h3>Declaratie</h3>
			<table>
				<tbody>
					<tr>
						<th>Gevraagde bedrag</th>
						<td>{formatPrice(data.purchase.DeclarationData.askedAmount)}</td>
					</tr>
					<tr>
						<th>Reden</th>
						<td>{data.purchase.DeclarationData.reason}</td>
					</tr>
					<tr>
						<th>Betaal methode</th>
						<td>{data.purchase.DeclarationData.methodOfPayment}</td>
					</tr>
					<tr>
						<th>Ontvangst methode</th>
						<td>{data.purchase.DeclarationData.receiveMethod.toLowerCase()}</td>
					</tr>
					{#if data.purchase.DeclarationData.iban}
						<tr>
							<th>IBAN</th>
							<td>{data.purchase.DeclarationData.iban}</td>
						</tr>
					{/if}
					<tr>
						<th>Status</th>
						<td>{data.purchase.DeclarationData.status.toLowerCase()}</td>
					</tr>
				</tbody>
			</table>
		</div>
	{/if}

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
		<tr>
			<th>Omschrijving</th>
			<th>Grootboek</th>
			<th>Hoeveelheid</th>
			<th>Prijs</th>
			<th>Totaal</th>
		</tr>
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
			<td colspan="3"></td>
			<td><i>Totaal</i></td>
			<td>{formatPrice(data.total)}</td>
		</tr>
	</tbody>
</table>

<h2>Gematchte transacties</h2>
<table class="striped">
	<thead>
		<tr>
			<th>Omschrijving</th>
			<th>Transactie</th>
			<th>Type</th>
			<th>Bedrag</th>
		</tr>
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
		<tr>
			<td colspan="2"></td>
			<td><i>Totaal</i></td>
			<td>{formatPrice(data.purchase.TransactionMatchRow.reduce((acc, { amount }) => acc + Number(amount), 0))}</td>
		</tr>
	</tbody>
</table>

<div class="actions">
	<a class="button" href="/ongeveer/purchases/create?id={data.purchase.id}">Bewerken</a>
</div>

<style lang="scss">
	.top {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
		flex-wrap: wrap;

		table {
			width: fit-content;
			height: fit-content;
		}

		th,
		td {
			text-align: left;
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

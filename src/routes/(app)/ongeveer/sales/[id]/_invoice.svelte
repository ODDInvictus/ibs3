<script lang="ts">
	import { formatDateHumanReadable } from '$lib/dateUtils'
	import { env } from '$env/dynamic/public'
	import type Decimal from 'decimal.js'
	import { formatPrice } from '$lib/textUtils'

	export let invoice: {
		id: number
		relation: {
			id: number
			name: string
			FinancialPersonDataOther?: {
				address?: string | null
				postalCode?: string | null
				city?: string | null
			} | null
			FinancialPersonDataUser?: {
				user: {
					email?: string | null
				}
			} | null
		}
		tav?: string | null
		date?: Date | null
		termsOfPayment: number
		description?: string | null
		Rows: {
			description: string
			amount: number
			price: number | Decimal
		}[]
		Treasurer?: {
			firstName: string
			lastName: string
		} | null
	}
</script>

<div id="invoice">
	<main>
		<div class="topbar" />
		<div class="top">
			<div>
				<p><b>{invoice.relation.name}</b></p>
				{#if invoice.tav}
					<p>T.a.v. {invoice.tav}</p>
				{/if}
				{#if invoice.relation.FinancialPersonDataOther}
					<p>{invoice.relation.FinancialPersonDataOther.address ?? ''}</p>
					<p>
						{invoice.relation.FinancialPersonDataOther.postalCode ?? ''}
						{invoice.relation.FinancialPersonDataOther.city ?? ''}
					</p>
				{:else if invoice.relation.FinancialPersonDataUser}
					<p>{invoice.relation.FinancialPersonDataUser.user.email ?? ''}</p>
				{/if}
			</div>
			<div>
				<img src="/logo.svg" alt="O.D.D. Invictus" />
			</div>
		</div>

		<div class="content">
			<p class="title">Factuur</p>
			<div class="info">
				<div class="column">
					<div>
						<p>Factuurnummer:</p>
						<p>Factuurdatum:</p>
						<p>Betalingstermijn:</p>
					</div>
					<div>
						<p>{invoice.id}</p>
						<p>{formatDateHumanReadable(new Date(invoice.date ?? ''))}</p>
						<p>{invoice.termsOfPayment} dagen</p>
					</div>
				</div>
				<div class="column">
					<div>
						{#if invoice.description}
							<p>Omschrijving:</p>
						{/if}
						<p>Klantnummer:</p>
						<p>Penningmeester:</p>
					</div>
					<div>
						{#if invoice.description}
							<p>{invoice.description ?? ''}</p>
						{/if}
						<p>{invoice.relation.id}</p>
						<p>{invoice.Treasurer?.firstName ?? ''} {invoice.Treasurer?.lastName ?? ''}</p>
					</div>
				</div>
			</div>

			<table>
				<thead>
					<th>Omschrijving</th>
					<th>Hoeveelheid</th>
					<th>Stukprijs</th>
					<th>Totaal</th>
				</thead>
				<tbody>
					{#each invoice.Rows as row}
						<tr>
							<td>{row.description}</td>
							<td>{row.amount}</td>
							<td>{formatPrice(row.price)}</td>
							<td>{formatPrice(row.amount * Number(row.price))}</td>
						</tr>
					{/each}
					<tr class="total">
						<td /><td />
						<td><i>Totaal</i></td>
						<td>
							{formatPrice(invoice.Rows.reduce((t, row) => t + row.amount * Number(row.price), 0))}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<footer>
			Gelieve binnen {invoice.termsOfPayment} dagen het bedrag van {invoice.Rows.reduce((t, row) => t + row.amount * Number(row.price), 0)} euro
			over te maken op rekeningnummer<br />{env.PUBLIC_IBAN} t.n.v. N. Rotmensen onder vermelding van het factuurnummer {invoice.id}.
			<div class="bottom-bar">
				<p>IBAN: {env.PUBLIC_IBAN}</p>
				<p>Email: questor@oddinvictus.nl</p>
			</div>
		</footer>
	</main>
</div>

<style lang="scss">
	@page {
		size: A4;
		margin: 0;
		print-color-adjust: exact;
	}

	@media print {
		html,
		body {
			width: 210mm;
			height: 297mm;
			print-color-adjust: exact;
			-webkit-print-color-adjust: exact;
		}
	}

	#invoice {
		width: 210mm;
		height: 297mm;
		box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 20px 0px;
		position: relative;
		background-color: white;
		color: black;
	}
	.topbar {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 1rem;
		background-color: var(--color-primary);
	}

	main {
		padding: 3rem 2rem 2rem 2rem;
		padding-bottom: 6rem;
		font-family: sans-serif !important;
	}
	.title {
		font-size: 2rem;
	}
	.top,
	.info {
		display: flex;
		justify-content: space-between;
	}
	.column {
		display: flex;
		gap: 1ex;
	}

	img {
		height: 4rem;
	}

	.content {
		margin-top: 1rem;
	}
	table {
		margin-top: 2rem;
	}
	tr:nth-child(odd):not(.total) {
		background-color: var(--color-table-stripe) !important;
	}
	tr:hover {
		background-color: transparent;
	}
	tr,
	th,
	td {
		border-bottom: none;
	}

	.bottom-bar {
		display: flex;
		justify-content: space-around;
		color: white;
		background-color: var(--color-primary);
		padding: 1rem;
		margin-top: 1rem;
	}
	footer {
		font-size: 0.8rem;
		position: absolute;
		bottom: 1rem;
		text-align: center;
		width: 100%;
		left: 0;
		bottom: 0;
	}
</style>

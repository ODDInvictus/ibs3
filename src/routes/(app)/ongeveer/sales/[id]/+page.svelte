<script lang="ts">
	import type { PageData } from './$types'
	import Invoice from './_invoice.svelte'
	import Title from '$lib/components/title.svelte'
	import Pencil from '~icons/tabler/Pencil'
	import EditRef from './_editRef.svelte'
	import { openModal } from 'svelte-modals'
	import { formatDateHumanReadable } from '$lib/dateUtils'
	import { formatPrice } from '$lib/textUtils'
	import DeleteButton from '$lib/ongeveer/DeleteButton.svelte'
	import { toast } from '$lib/notification'

	export let data: PageData
</script>

<Title title={data.invoice.ref || 'Factuur'} />

<main>
	<table class="info">
		<h2>Info</h2>
		<tr>
			<th>Factuurnummer</th>
			<td>{data.invoice.id}</td>
		</tr>
		<tr>
			<th>Referentie:</th>
			<td>
				{data.invoice.ref ?? '...'}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<i
					on:click={() =>
						openModal(EditRef, {
							form: data.form,
						})}>
					<Pencil color="#777" class="pointer" />
				</i>
			</td>
		</tr>
		<tr>
			<th>Factuurdatum</th>
			<td>{data.invoice.date ? formatDateHumanReadable(new Date(data.invoice.date)) : '-'}</td>
		</tr>
		<tr>
			<th>Betalingstermijn</th>
			<td>{data.invoice.termsOfPayment} dagen</td>
		</tr>
		<tr>
			<th>Omschrijving</th>
			<td>{data.invoice.description ?? '-'}</td>
		</tr>
		<tr>
			<th>Relatie</th>
			<td>
				<a href="/ongeveer/relations/{data.invoice.relationId}">
					{data.invoice.relationId} - {data.invoice.relation.name}
				</a>
			</td>
		</tr>
		<tr>
			<th>Penningmeester</th>
			<td>{data.invoice.Treasurer?.firstName}</td>
		</tr>
		<h2 class="mt-4">Status</h2>
		<tr>
			<th>Totaal</th>
			<td>{formatPrice(data.total)}</td>
		</tr>
		<tr>
			<th>Betaald</th>
			<td>{formatPrice(data.paid)}</td>
		</tr>
		<tr>
			<th>Resterend</th>
			<td>{formatPrice(data.toPay)}</td>
		</tr>
		<tr>
			<th>Status:</th>
			<td>{data.invoice.date ? (data.toPay <= 0 ? 'Betaald' : 'Verstuurd') : 'Concept'}</td>
		</tr>
		<div class="ongeveer-nav mt-4">
			{#if data.invoice.date}
				<button
					class:disabled={data.toPay === 0}
					on:click={async () => {
						if (data.toPay === 0) {
							toast({
								message: 'Deze factuur is al betaald',
								type: 'danger',
								title: 'Niet toegestaan',
							})
						} else {
							const res = await fetch('', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
							})
							if (res.ok) {
								location.reload()
							} else {
								const msg = await res.text()
								toast({
									message: msg,
									type: 'danger',
									title: 'Fout bij betalen',
								})
							}
						}
					}}>
					Betaal met saldo
				</button>
				<button
					class="disabled"
					on:click={() => {
						toast({
							message: 'Je kan deze factuur niet meer bewerken',
							type: 'danger',
							title: 'Niet toegestaan',
						})
					}}>Bewerken</button>
			{:else}
				<a href="/ongeveer/sales/{data.invoice.id}/process">Verwerken</a>
				<a href="/ongeveer/sales/create?id={data.invoice.id}">Bewerken</a>
			{/if}
			<DeleteButton
				url="/ongeveer/sales/{data.invoice.id}"
				redirect="/ongeveer/sales"
				confirmMessage="Weet je zeker dat je deze factuur wilt verwijderen?"
				disabled={data.paid > 0} />
		</div>
	</table>

	{#if data.invoice.date}
		<div class="print">
			<a href="/ongeveer/sales/{data.invoice.id}/print" class="button" target="_blank">Print/PDF</a>
			<Invoice invoice={data.invoice} />
		</div>
	{/if}

	<div class:bottom={data.invoice.date}>
		<h2>Uitgesplitst</h2>
		<table class="striped">
			<thead>
				<th>Omschrijving</th>
				<th>Aantal</th>
				<th>Prijs</th>
				<th>Grootboek</th>
				<th>Product</th>
			</thead>
			<tbody>
				{#each data.invoice.Rows as row}
					<tr>
						<td>{row.description}</td>
						<td>{row.amount}</td>
						<td>{formatPrice(row.price)}</td>
						<td>
							<a href="/ongeveer/ledger/{row.Ledger.id}">{row.Ledger.id} - {row.Ledger.name}</a>
						</td>
						<td>
							{#if row.Product}
								<a href="/ongeveer/products/{row.Product.id}">{row.Product.name}</a>
							{:else}
								-
							{/if}
						</td>
					</tr>
				{/each}
				<tr>
					<td><i>Totaal</i></td>
					<td />
					<td><i>{formatPrice(data.total)}</i></td>
					<td colspan="2" />
				</tr>
			</tbody>
		</table>
	</div>

	<div class="bottom">
		<h2>Gematchte transacties</h2>
		<table class="striped">
			<thead>
				<th>Omschrijving</th>
				<th>Transactie</th>
				<th>Type</th>
				<th>Bedrag</th>
			</thead>
			<tbody>
				{#if data.invoice.TransactionMatchRow.length === 0}
					<tr>
						<td colspan="4">Nog niks gematcht</td>
					</tr>
				{/if}
				{#each data.invoice.TransactionMatchRow as { amount, description, Transaction }}
					<tr>
						<td>{description ?? '-'}</td>
						<td><a href="/ongeveer/transaction/{Transaction.id}">#{Transaction.id}</a></td>
						<td>{Transaction.type === 'BANK' ? 'Bank' : 'Saldo'}</td>
						<td>{formatPrice(amount)}</td>
					</tr>
				{/each}
				<tr>
					<td><i>Totaal</i></td>
					<td colspan="2" />
					<td>{formatPrice(data.paid)}</td>
				</tr>
			</tbody>
		</table>
	</div>
</main>

<style lang="scss">
	main {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
		justify-content: space-evenly;
		flex-wrap: wrap;

		table.info {
			width: fit-content;
			height: fit-content;

			th,
			td {
				text-align: left;
			}

			:global(.pointer) {
				cursor: pointer;
				transition: color 0.2s ease;

				&:hover {
					color: var(--text-color);
				}
			}
		}

		.print {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			position: relative;
			min-width: 397px;
			min-height: 624px;

			a {
				width: fit-content;
			}

			:global(#invoice) {
				transform-origin: top left;
				transform: scale(0.5);
				position: absolute;
				top: 4rem;
			}
		}

		.bottom {
			width: 100%;
		}
	}
</style>

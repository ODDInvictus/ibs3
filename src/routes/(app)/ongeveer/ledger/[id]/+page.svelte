<script lang="ts">
	import type { PageData } from './$types'

	import Title from '$lib/components/title.svelte'
	import { formatDateHumanReadable } from '$lib/dateUtils'
	import { toast } from '$lib/notification'
	import { formatPrice } from '$lib/textUtils'
	import Decimal from 'decimal.js'
	import Pagination from '$lib/components/Pagination.svelte'

	export let data: PageData
</script>

<Title title={data.ledger?.name ?? 'Niet gevonden'} />

<div class="top">
	<div class="left">
		<h2>Info</h2>
		<table>
			<tbody>
				<tr>
					<th>ID</th>
					<td>{data.ledger.id}</td>
				</tr>
				<tr>
					<th>Omschrijving</th>
					<td>{data.ledger.description}</td>
				</tr>
				<tr>
					<th>Balans</th>
					<td>{formatPrice(data.balance)}</td>
				</tr>
				<tr>
					<th>Actief</th>
					<td>{data.ledger.isActive ? 'Ja' : 'Nee'}</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="right">
		<a class="button" href="/ongeveer/ledger/{data.ledger.id}/edit">Bewerken</a>
		<button
			on:click={async () => {
				const res = await fetch('', {
					method: 'PATCH',
				})

				if (res.ok) {
					if (data.ledger) data.ledger.isActive = !data.ledger.isActive
					else window.location.reload()
				} else {
					toast({
						title: res.statusText,
						message: 'Er is iets misgegaan bij het uitschakelen van het grootboek.',
						type: 'danger',
					})
				}
			}}>{data.ledger.isActive ? 'Uitschakelen' : 'Inschakelen'}</button>
		<button
			class="btn-danger"
			data-testid="delete-btn"
			disabled={!data.canDelete}
			on:click={async () => {
				const confirmed = confirm('Weet je zeker dat je dit grootboek wilt verwijderen?')
				if (!confirmed) return

				const res = await fetch('', {
					method: 'DELETE',
				})

				if (res.ok) {
					window.location.href = '/ongeveer/ledger'
				} else {
					toast({
						title: res.statusText,
						message: await res.text(),
						type: 'danger',
					})
				}
			}}>Verwijder</button>
	</div>
</div>

<h2>Boekstukken</h2>
<table>
	<thead>
		<tr>
			<th>Boekstuknummer</th>
			<th>Omschrijving</th>
			<th>Bedrag</th>
			<th>Datum</th>
		</tr>
	</thead>
	<tbody>
		{#if data.ledger.JournalRows.length === 0}
			<tr>
				<td colspan="4">Geen boekstukken gevonden</td>
			</tr>
		{/if}
		{#each data.ledger.JournalRows as row}
			{@const { Journal, amount, description, price } = row}
			<tr>
				<td><a href="/ongeveer/journal/{Journal.id}">{Journal.id}</a></td>
				<td>{description}</td>
				<td>
					{Journal.type == 'SALE' ? '' : '- '}
					{formatPrice(new Decimal(price).mul(amount))}
				</td>
				<td>{Journal.date ? formatDateHumanReadable(new Date(Journal.date)) : '-'}</td>
			</tr>
		{/each}
	</tbody>
</table>

<Pagination url="/ongeveer/ledger/{data.ledger.id}" p={data.p} size={data.size} />

<style lang="scss">
	.top {
		display: grid;
		grid-template-columns: 1fr 1fr;
		width: 100%;
		margin: 2rem 0;

		table {
			width: fit-content;

			th,
			td {
				text-align: left;
			}
		}

		.right {
			display: flex;
			gap: 1rem;

			@media screen and (max-width: 600px) {
				flex-direction: column;
			}

			button,
			a {
				height: fit-content;
			}
		}
	}
</style>

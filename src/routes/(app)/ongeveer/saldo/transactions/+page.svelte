<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte'
	import Title from '$lib/components/title.svelte'
	import { formatDateTimeHumanReadable } from '$lib/dateUtils'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<div id="root">
	<div id="sales">
		<Title title="Saldo transacties" shortTitle="Transacties" />

		<div class="ongeveer-nav">
			<a href="/ongeveer/saldo/transactions/create">Transactie maken</a>
			<a href="/ongeveer/saldo">Saldo overzicht</a>
		</div>

		{#if data.transactions.length == 0}
			<div class="not-found">
				<h2>Geen transacties gevonden</h2>

				<p>Maak eerst een aantal verkopen, declaraties etc. aan</p>
			</div>
		{/if}

		<table class="striped small">
			<thead>
				<tr>
					<th>ID</th>
					<th>Datum</th>
					<th>Beschrijving</th>
					<th>Prijs</th>
					<th>Van</th>
					<th>Naar</th>
				</tr>
			</thead>
			<tbody>
				{#each data.transactions as transaction}
					{@const { price, description, from, to, Transaction, id } = transaction}
					<tr>
						<td><a href="/ongeveer/saldo/transactions/{id}">{id}</a></td>
						<td>{formatDateTimeHumanReadable(new Date(Transaction.createdAt))}</td>
						<td>{description}</td>
						<td>€ {Number(price).toFixed(2)}</td>
						<td><a href="/ongeveer/relations/{from.id}">{from.name}</a></td>
						<td><a href="/ongeveer/relations/{to.id}">{to.name}</a></td>
					</tr>
				{/each}
			</tbody>
		</table>
		<Pagination size={data.size} p={data.p} url="/ongeveer/saldo/transactions" />
	</div>
</div>

<style lang="scss">
	.not-found {
		text-align: center;
	}
</style>

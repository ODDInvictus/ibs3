<script lang="ts">
	import Callout from '$lib/components/callout.svelte'
	import Title from '$lib/components/title.svelte'
	import { formatDateTimeHumanReadable } from '$lib/dateUtils'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Title title="Ongeveer" shortTitle="Home" />

<Callout type="caution">Ongeveer wordt niet meer gebruikt! Deze pagina is alleen maar beschikbaar voor historische redenen</Callout>

<main>
	<div class="column">
		<div class="ibs-card outline">
			<h2 class="ibs-card--title">Declaraties</h2>
			<p class="ibs-card--content">Er zijn {data.pendingDeclarations.length} openstaande declaraties</p>
			{#each data.pendingDeclarations.slice(0, 5) as decla}
				{#if decla.Journal}
					<p class="ibs-card--row">
						<a href="/ongeveer/journal/{decla.Journal.id}">{decla.Journal.id} - {decla.Journal.ref}</a>
					</p>
				{:else}
					<p class="ibs-card--row">Niet ingeboekt: {decla.id} - {decla.reason}</p>
				{/if}
			{/each}
			{#if data.pendingDeclarations.length > 5}
				<p class="ibs-card--row">... en nog {data.pendingDeclarations.length - 5} meer</p>
			{/if}
			<p class="ibs-card--content">
				<a href="/ongeveer/purchases">Overzicht</a>
			</p>
		</div>

		<div class="ibs-card outline">
			<h2 class="ibs-card--title">Banktransacties</h2>
			<p class="ibs-card--content">Er zijn {data.unmatchedBankTransactions.length} ongematchde banktransacties</p>
			{#each data.unmatchedBankTransactions.slice(0, 5) as transaction}
				<p class="ibs-card--row">
					<a href="/ongeveer/transaction/{transaction.id}">
						{transaction.id} - {transaction.BankTransaction?.ref ?? transaction.BankTransaction?.description ?? '?'}
					</a>
				</p>
			{/each}
			{#if data.unmatchedBankTransactions.length > 5}
				<p class="ibs-card--row">... en nog {data.unmatchedBankTransactions.length - 5} meer</p>
			{/if}
			<p class="ibs-card--content">
				<a href="/ongeveer/bank">Overzicht</a>
			</p>
		</div>

		<div class="ibs-card outline">
			<h2 class="ibs-card--title">Sync met Revolut</h2>
			<p class="ibs-card--content">
				Laatste keer banktransacties gesynchroniseerd: {data.bankTransactionsLastUpdated
					? formatDateTimeHumanReadable(data.bankTransactionsLastUpdated)
					: 'nooit'}
			</p>
			<p class="ibs-card--content">
				<a href="/ongeveer/bank/upload">Banktransacties uploaden</a>
			</p>
		</div>
	</div>

	<div class="column">
		<div class="ibs-card outline">
			<h2 class="ibs-card--title">Saldotransacties</h2>
			<p class="ibs-card--content">Er zijn {data.unmatchedSaldoTransactions.length} ongematchde saldotransacties</p>
			{#each data.unmatchedSaldoTransactions.slice(0, 5) as transaction}
				<p class="ibs-card--row">
					<a href="/ongeveer/transaction/{transaction.id}">{transaction.id} - {transaction.SaldoTransaction?.description ?? '?'}</a>
				</p>
			{/each}
			{#if data.unmatchedSaldoTransactions.length > 5}
				<p class="ibs-card--row">... en nog {data.unmatchedSaldoTransactions.length - 5} meer</p>
			{/if}
			<p class="ibs-card--content">
				<a href="/ongeveer/saldo/transactions">Overzicht</a>
			</p>
		</div>

		<div class="ibs-card outline">
			<h2 class="ibs-card--title">Overdatum aankopen</h2>
			<p class="ibs-card--content">Er zijn {data.overduePurchases.length} aankopen overdatum</p>
			{#each data.overduePurchases.slice(0, 5) as purchase}
				<p class="ibs-card--row">
					<a href="/ongeveer/purchases/{purchase.id}">{purchase.id} - {purchase.ref ?? purchase.description ?? '?'}</a>
				</p>
			{/each}
			{#if data.overduePurchases.length > 5}
				<p class="ibs-card--row">... en nog {data.overduePurchases.length - 5} meer</p>
			{/if}
			<p class="ibs-card--content">
				<a href="/ongeveer/purchases">Overzicht</a>
			</p>
		</div>
	</div>
</main>

<style lang="scss">
	main {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 2rem;

		.column {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>

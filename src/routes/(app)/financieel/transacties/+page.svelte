<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
	import { toDateString } from '$lib/dateUtils'
	import { formatMoney } from '$lib/utils'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Title title="Transacties" />

<table class="striped small">
	<thead>
		<tr>
			<th>Datum</th>
			<th>Beschrijving</th>
			<th>Bedrag</th>
		</tr>
	</thead>
	<tbody>
		{#each data.transactions as { price, description, from, Transaction, id }}
			{@const streeplijstId = Transaction.TransactionMatchRow.find(row => row.Journal?.streeplijstId !== null)?.Journal?.streeplijstId}
			<tr>
				<td>{toDateString(new Date(Transaction.createdAt))}</td>
				<td>
					{#if streeplijstId}
						<a href="/financieel/streeplijst/{streeplijstId}">{description}</a>
					{:else}
						{description}
					{/if}
				</td>
				<td>
					<a href="/financieel/transacties/{id}">
						{formatMoney(Number(price) * (from.id === data.financialPersonId ? -1 : 1))}
					</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<Pagination size={data.size} p={data.p} url="/financieel/transacties" />

<div class="ongeveer-nav">
	<a href="/financieel/transacties/nieuw">Transactie maken</a>
	<a href="/financieel" class="button">Terug</a>
</div>

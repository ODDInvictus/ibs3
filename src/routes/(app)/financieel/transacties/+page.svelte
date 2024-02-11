<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { toDateString } from '$lib/dateUtils';
	import { formatMoney } from '$lib/utils';
	import Back from '$lib/components/Back.svelte';

	export let data: PageData;

	let innerWidth: number;
</script>

<svelte:window bind:innerWidth />

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
		{#each data.transactions as transaction}
			{@const { price, description, from, to, Transaction, id } = transaction}
			{@const streeplijstId = Transaction.TransactionMatchRow.find(
				(row) => row.Journal?.streeplijstId !== null
			)?.Journal?.streeplijstId}
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
						{from.id === data.financialPersonId ? '-' : '+'}
						{formatMoney(price)}
					</a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<Pagination size={data.size} p={data.p} url="/financieel/transacties" />

{#if innerWidth < 600}
	<a href="/financieel" class="button mobile">Terug</a>
{/if}

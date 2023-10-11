<script lang="ts">
	import type { PageData } from './$types';
	import { formatDateTimeHumanReadable } from '$lib/dateUtils';
	import Title from '$lib/components/title.svelte';

	export let data: PageData;
</script>

<Title title="Bank transactions" />
<a href="/financieel/bank/upload" class="button">Upload bank transactions</a>
<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Date</th>
			<th>Referentie</th>
			<th>Description</th>
			<th>Amount</th>
		</tr>
	</thead>
	<tbody>
		{#each data.bankTransactions as transaction}
			<tr>
				<td><a href="/financieel/bank/{transaction.id}">{transaction.id}</a></td>
				<td
					>{transaction.completedDate
						? formatDateTimeHumanReadable(new Date(transaction.completedDate))
						: 'Pending'}</td
				>
				<td>{transaction.ref ?? ''}</td>
				<td>{transaction.description}</td>
				<td>{transaction.amount}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		margin-top: 2rem;
	}
</style>

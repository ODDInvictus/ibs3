<script lang="ts">
	import type { PageData } from './$types';
	import { formatDateTimeHumanReadable } from '$lib/dateUtils';
	import Title from '$lib/components/title.svelte';
	import Check from '~icons/tabler/check';
	import Dot from '~icons/tabler/point-filled';
	import Cross from '~icons/tabler/x';

	export let data: PageData;
</script>

<Title title="Bank transactions" />
<a href="/ongeveer/bank/upload" class="button">Upload bank transactions</a>
<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Datum</th>
			<th>Referentie / Omschrijving</th>
			<th>Bedrag</th>
			<th>Status</th>
		</tr>
	</thead>
	<tbody>
		{#each data.bankTransactions as transaction}
			<tr>
				<td><a href="/ongeveer/bank/{transaction.id}">{transaction.id}</a></td>
				<td>
					{transaction.completedDate
						? formatDateTimeHumanReadable(new Date(transaction.completedDate))
						: 'Pending'}
				</td>
				<td>{transaction.ref ? `${transaction.ref} / ` : ''}{transaction.description}</td>
				<td>{transaction.amount}</td>
				<td>
					{#if transaction.status == 'MATCHED'}
						<Check color="#0F0" />
					{:else if transaction.status == 'PARTIAL'}
						<Dot color="#F80" />
					{:else}
						<Cross color="#F00" />
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		margin-top: 2rem;
	}
</style>

<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import { formatMoney } from '$lib/utils';
	import { toDateString } from '$lib/dateUtils';
	import Pagination from '$lib/components/Pagination.svelte';

	export let data: PageData;
</script>

<Title title="Consumpties" />

<table class="small striped">
	<thead>
		<th>Omschrijving</th>
		<th>Prijs p/s</th>
		<th>Aantal</th>
		<th>Invoer datum</th>
		<th>Steeplijst</th>
	</thead>
	<tbody>
		{#each data.sales as sale}
			{@const date = sale.Journal.date}
			{@const streeplijstId = sale.Journal.streeplijstId}
			<tr>
				<td>{sale.description}</td>
				<td>{formatMoney(sale.price)}</td>
				<td>{sale.amount}</td>
				<td>
					{#if date}
						{toDateString(new Date(date))}
					{:else}
						-
					{/if}
				</td>
				<td>
					{#if streeplijstId !== null}
						<a href="/financieel/streeplijst/{streeplijstId}">#{streeplijstId}</a>
					{:else}
						-
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<Pagination size={data.size} p={data.p} url="/financieel/consumpties" />

<div class="ongeveer-nav">
	<a href="/financieel">Terug</a>
</div>

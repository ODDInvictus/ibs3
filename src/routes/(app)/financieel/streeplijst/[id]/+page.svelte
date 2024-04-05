<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import { formatDateHumanReadable } from '$lib/dateUtils'
	import { formatMoney } from '$lib/utils'
	import Back from '$lib/components/Back.svelte'

	export let data: PageData
</script>

<Title title="Streeplijst #{data.tallySheet.id}" />

<h2>Info</h2>

<table>
	<tr>
		<th>Begin datum</th>
		{#if data.tallySheet.startDate}
			<td>{formatDateHumanReadable(new Date(data.tallySheet.startDate))}</td>
		{:else}
			<td>-</td>
		{/if}
	</tr>
	<tr>
		<th>Eind datum</th>
		{#if data.tallySheet.endDate}
			<td>{formatDateHumanReadable(new Date(data.tallySheet.endDate))}</td>
		{:else}
			<td>-</td>
		{/if}
	</tr>
	<tr>
		<th>Invoer datum</th>
		<td>{formatDateHumanReadable(new Date(data.tallySheet.createdAt))}</td>
	</tr>
</table>

<h2>Steeplijst</h2>
<table>
	<thead>
		<th>Product</th>
		<th>Hoeveelheid</th>
		<th>Prijs p/s</th>
	</thead>
	<tbody>
		{#each data.tallySheet.sales as sale}
			{#each sale.Rows as row}
				<tr>
					<td>{row.description}</td>
					<td>{row.amount}</td>
					<td>{formatMoney(row.price)}</td>
				</tr>
			{/each}
		{/each}
	</tbody>
</table>

<Back />

<style>
	h2 {
		margin-top: 1rem;
	}

	table {
		margin-bottom: 2rem;
	}
</style>

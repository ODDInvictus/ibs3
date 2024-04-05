<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import { formatMoney } from '$lib/utils'
	import { formatDateTimeHumanReadable } from '$lib/dateUtils'
	import Back from '$lib/components/Back.svelte'

	export let data: PageData
</script>

<Title title="Transactie" />

<table>
	<tr>
		<th>Van</th>
		<td>{data.transaction.from.name}</td>
	</tr>
	<tr>
		<th>Naar</th>
		<td>{data.transaction.to.name}</td>
	</tr>
	<tr>
		<th>Bedrag</th>
		<td>{formatMoney(data.transaction.price)}</td>
	</tr>
	<tr>
		<th>Beschrijving</th>
		<td>{data.transaction.description}</td>
	</tr>
	<tr>
		<th>Datum</th>
		<td>{formatDateTimeHumanReadable(new Date(data.transaction.Transaction.createdAt))}</td>
	</tr>
</table>

<Back />

<style>
	table {
		margin-bottom: 2rem;
	}
</style>

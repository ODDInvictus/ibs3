<script lang="ts">
	import type { PageData } from './$types'
	import Title from '$lib/components/title.svelte'
	import { formatDateHumanReadable, formatDateTimeHumanReadable } from '$lib/dateUtils'
	import Check from '~icons/tabler/check'
	import Cross from '~icons/tabler/x'
	import Pagination from '$lib/components/Pagination.svelte'

	export let data: PageData
</script>

<Title title="Streeplijst" />

<div class="ongeveer-nav">
	<a href="/ongeveer/sales">Terug</a>
	<a href="/ongeveer/tallysheet/create">Streeplijst verwerken</a>
</div>

<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Invoer datum</th>
			<th>Begin datum</th>
			<th>Eind datum</th>
			<th>Status</th>
		</tr>
	</thead>
	<tbody>
		{#each data.sheets as sheet}
			{@const { id, createdAt, startDate, endDate } = sheet.sheet}
			<tr>
				<td><a href="/ongeveer/tallysheet/{id}">{id}</a></td>
				<td>{formatDateTimeHumanReadable(createdAt)}</td>
				<td>{startDate ? formatDateHumanReadable(startDate) : '-'}</td>
				<td>{endDate ? formatDateHumanReadable(endDate) : '-'}</td>
				{#if sheet.isProcessed}
					<td><Check color="#0F0" /></td>
				{:else}
					<td><Cross color="#F00" /></td>
				{/if}
			</tr>
		{/each}
	</tbody>
</table>

<Pagination size={data.size} p={data.p} url="/ongeveer/tallysheet" />

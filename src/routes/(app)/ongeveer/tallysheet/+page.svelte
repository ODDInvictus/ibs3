<script lang="ts">
	import type { PageData } from './$types';
	import Title from '$lib/components/title.svelte';
	import { formatDateHumanReadable, formatDateTimeHumanReadable } from '$lib/dateUtils';

	export let data: PageData;
</script>

<Title title="Streeplijst" />

<div class="ongeveer-nav">
	<a href="/ongeveer/sales">Terug</a>
	<a href="/ongeveer/tallysheet/create">Streeplijst verwerken</a>
</div>

<table>
	<thead>
		<th>ID</th>
		<th>Verwerk datum</th>
		<th>Begin datum</th>
		<th>Eind datum</th>
	</thead>
	<tbody>
		{#each data.sheets as sheet}
			{@const { id, createdAt, startDate, endDate } = sheet}
			<tr>
				<td><a href="/ongeveer/tallysheet/{id}">{id}</a></td>
				<td>{formatDateTimeHumanReadable(createdAt)}</td>
				<td>{startDate ? formatDateHumanReadable(startDate) : '-'}</td>
				<td>{endDate ? formatDateHumanReadable(endDate) : '-'}</td>
			</tr>
		{/each}
	</tbody>
</table>

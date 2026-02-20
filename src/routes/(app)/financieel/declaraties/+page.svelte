<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import type { PageData } from './$types'
	import { formatDateTimeHumanReadable } from '$lib/dateUtils'
	import { formatPrice } from '$lib/textUtils'
	import Pagination from '$lib/components/Pagination.svelte'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	let innerWidth: number = $state()
</script>

<svelte:window bind:innerWidth />

<Title title="Declaratie overzicht" />

<table class="striped">
	<thead>
		<tr>
			<th>Status</th>
			<th>Reden</th>
			<th>Prijs</th>
			<th>Indien datum</th>
		</tr>
	</thead>
	<tbody>
		{#if !data.declarations.length}
			<tr>
				<td colspan="4">Geen declaraties gevonden</td>
			</tr>
		{/if}
		{#each data.declarations as { id, date, description, total, status }}
			<tr>
				<td>
					{#if status === 'PENDING'}
						In behandeling
					{:else if status === 'ACCEPTED'}
						Goedgekeurd
					{:else if status === 'DECLINED'}
						Afgekeurd
					{:else}
						?
					{/if}
				</td>
				<td><a href="/financieel/declaraties/{id}">{description ?? '?'}</a></td>
				<td>{formatPrice(total)}</td>
				<td>{date ? formatDateTimeHumanReadable(new Date(date)) : '?'}</td>
			</tr>
		{/each}
	</tbody>
</table>

<Pagination url="/financieel/declaraties" p={data.p} size={data.size} />

<div class="ongeveer-nav">
	<a href="/financieel">Terug</a>
</div>

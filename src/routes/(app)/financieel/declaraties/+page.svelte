<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import type { PageData } from './$types';
	import { formatDateTimeHumanReadable } from '$lib/dateUtils';
	import { goto } from '$app/navigation';
	import { formatMoney } from '$lib/utils';

	export let data: PageData;
</script>

<div id="root">
	<Title title="Declaratie overzicht" shortTitle="Declaratie overzicht" />

	<div class="table-wrapper">
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
						<td colspan="4">
							<p id="no-decla">Geen declaraties gevonden</p>
						</td>
					</tr>
				{/if}
				{#each data.declarations as declaration}
					{@const { id, date, description, total, status } = declaration}
					<tr on:click={() => goto(`/financieel/declaraties/${id}`)}>
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
						<td>{description ?? '?'}</td>
						<td class="price">{formatMoney(total)}</td>
						<td>{declaration.date ? formatDateTimeHumanReadable(new Date(date)) : '?'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style lang="scss">
	.buttons {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	@media (max-width: 600px) {
		#root {
			overflow: hidden;
		}

		.table-wrapper {
			overflow-x: scroll;
		}

		table {
			width: 100%;
			overflow: scroll;
		}

		tr {
			height: 0;
		}

		td {
			height: 0;
		}
	}

	#no-decla {
		font-size: 1.1rem;
	}

	.link:hover {
		text-decoration: underline;
		cursor: pointer;
	}

	tr {
		cursor: pointer;
	}
</style>

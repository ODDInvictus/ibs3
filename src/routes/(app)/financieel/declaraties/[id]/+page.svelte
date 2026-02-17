<script lang="ts">
	import type { PageData } from './$types'
	import { formatDateHumanReadable } from '$lib/dateUtils'
	import Title from '$lib/components/title.svelte'
	import { formatMoney } from '$lib/utils'
	import Attachment from '$lib/ongeveer/Attatchment.svelte'

	export let data: PageData
</script>

<Title title="Declaratie #{data.declaration.id}" shortTitle="Declaratie" />

<div id="root">
	<div id="left">
		<h2>Info</h2>
		<table>
			<tbody>
				<tr>
					<th>Declarant</th>
					<td>{data.user.firstName}</td>
				</tr>
				<tr>
					<th>Bedrag</th>
					<td>{formatMoney(data.declaration.total)}</td>
				</tr>
				<tr>
					<th>Reden</th>
					<td>{data.declaration.description ?? ''}</td>
				</tr>
				<tr>
					<th>Indien datum</th>
					<td>{data.declaration.date ? formatDateHumanReadable(new Date(data.declaration.date)) : '?'}</td>
				</tr>
				<tr>
					<th>Status</th>
					<td>{data.declaration.status.toLowerCase()}</td>
				</tr>
				<tr>
					<th>Betaal methode</th>
					<td>{data.declaration.methodOfPayment}</td>
				</tr>
			</tbody>
		</table>
	</div>

	{#if data.declaration.Attachments.length > 0}
		<div class="receipts">
			<h2>Bonnetjes</h2>
			<Attachment previews={data.declaration.Attachments} noDelete />
		</div>
	{/if}
</div>

<style lang="scss">
	img {
		max-width: 25vw;
	}

	@media (min-width: 600px) {
		#root {
			display: grid;
			grid-template-columns: 1fr 2fr;
		}
	}

	#root {
		display: block;
	}

	#left {
		p {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			margin: 0.5rem 0;
		}

		table {
			width: fit-content;

			th,
			td {
				text-align: left;
			}
		}
	}

	@media (max-width: 600px) {
		.receipts {
			margin-top: 1rem;
		}

		img {
			max-width: 80lvw;
		}
	}
</style>

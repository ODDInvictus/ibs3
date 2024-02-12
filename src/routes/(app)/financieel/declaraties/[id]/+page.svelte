<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Check from '~icons/tabler/square-rounded-check';
	import UserCircle from '~icons/tabler/user-circle';
	import CurrencyEuro from '~icons/tabler/coin-euro';
	import QuestionMarkCircle from '~icons/tabler/help';
	import CalendarDays from '~icons/tabler/calendar';
	import Banknotes from '~icons/tabler/cash-banknote';
	import type { PageData } from './$types';
	import { formatDateHumanReadable } from '$lib/dateUtils';
	import Title from '$lib/components/title.svelte';
	import { formatMoney } from '$lib/utils';

	export let data: PageData;

	function formatPrice(price: number): string {
		const p = price.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' }).split('€')[1];
		return p.substring(1);
	}
</script>

<Title title="Declaratie #{data.declaration.id}" shortTitle="Declaratie" />

<div id="root">
	<div id="left">
		<table>
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
				<td
					>{data.declaration.date
						? formatDateHumanReadable(new Date(data.declaration.date))
						: '?'}</td
				>
			</tr>
			<tr>
				<th>Status</th>
				<td>{data.declaration.status.toLowerCase()}</td>
			</tr>
			<tr>
				<th>Betaal methode</th>
				<td>{data.declaration.methodOfPayment}</td>
			</tr>
			<tr>
				<th>Bericht</th>
				<td>{data.declaration.message ?? '-'}</td>
			</tr>
		</table>
	</div>

	{#if data.declaration.Attachments.length > 0}
		<div class="receipts">
			<h2>Bonnetjes</h2>
			{#each data.declaration.Attachments as attachment}
				<!-- TODO niet image bestanden -->
				<!-- TODO: @niels replace with new endpoint -->
				<img
					src="{env.PUBLIC_UPLOAD_URL}purchases/{attachment.filename}"
					alt="Helaas is hier geen bonnetje voor geupload :("
				/>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	img {
		max-width: 25vw;
	}

	#root {
		display: grid;
		grid-template-columns: 1fr 1fr;
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

			// th {
			// 	display: flex;
			// 	align-items: center;
			// }
		}
	}

	@media (max-width: 600px) {
		#root {
			grid-template-columns: 1fr;
		}

		.receipts {
			margin-top: 1rem;
		}

		img {
			max-width: 80lvw;
		}
	}
</style>

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

	export let data: PageData;

	function formatPrice(price: number): string {
		const p = price.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' }).split('€')[1];
		return p.substring(1);
	}
</script>

<div id="root">
	<div id="left">
		<h1>Declaratie #{data.declaration.id}</h1>
		<p title="Declarant"><UserCircle />{data.user.firstName}</p>
		<p title="Geld"><CurrencyEuro /> {formatPrice(data.declaration.total)}</p>
		<p title="Reden"><QuestionMarkCircle />{data.declaration.description ?? ''}</p>
		<p title="Wanneer">
			<CalendarDays />
			{data.declaration.date ? formatDateHumanReadable(new Date(data.declaration.date)) : '?'}
		</p>
		<p title="Betaalmethode"><Banknotes /> {data.declaration.methodOfPayment}</p>
		<p title="Status acceptatie">
			<Check />
			{data.declaration.status?.toLowerCase() ?? '?'}
		</p>
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

	#receipt {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#left {
		p {
			display: flex;
			align-items: center;
			cursor: help;
			gap: 0.5rem;
			margin: 0.5rem 0;
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

<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import Check from '~icons/tabler/square-rounded-check';
	import UserCircle from '~icons/tabler/user-circle';
	import CurrencyEuro from '~icons/tabler/coin-euro';
	import QuestionMarkCircle from '~icons/tabler/help';
	import CalendarDays from '~icons/tabler/calendar';
	import Banknotes from '~icons/tabler/cash-banknote';

	function formatPrice(price: number): string {
		const p = price.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' }).split('€')[1];
		return p.substring(1);
	}

	function accepted(accepted: boolean, denied: boolean): string {
		if (accepted) return 'Geaccepteerd';
		if (denied) return 'Afgewezen';
		return 'Nog niet beoordeeld';
	}

	const d = $page.data.declaration;
</script>

<div id="root">
	<div id="left">
		<h1>Declaratie #{d.id}</h1>
		<p title="Declarant"><UserCircle /> {d.person.name}</p>
		<p title="Geld"><CurrencyEuro /> {formatPrice(d.price)}</p>
		<p title="Reden"><QuestionMarkCircle /> {d.reason}</p>
		<p title="Wanneer"><CalendarDays /> {new Date(d.createdAt).toLocaleString('nl-NL')}</p>
		<p title="Betaalmethode"><Banknotes /> {d.methodOfPayment}</p>
		<p title="Status acceptatie"><Check /> {accepted(d.accepted, d.denied)}</p>

		Accepteren? Ga dan naar het&nbsp;<a href="/financieel/declaratie/overzicht">overzicht</a>
	</div>

	<div id="receipt">
		<img
			src={env.PUBLIC_UPLOAD_URL + 'receipts/' + $page.data.declaration.receipt}
			alt="Helaas is hier geen bonnetje voor geupload :("
		/>
	</div>
</div>

<style lang="scss">
	a {
		color: purple;
	}

	a:hover {
		text-decoration: underline;
	}

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

		#receipt {
			margin-top: 1rem;
		}

		img {
			max-width: 80lvw;
		}
	}
</style>

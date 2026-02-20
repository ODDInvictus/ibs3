<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import Decimal from 'decimal.js'
	import type { PageData } from './$types'
	import { formatMoney } from '$lib/utils'
	import ShoppingCart from '~icons/tabler/shopping-cart'
	import Coins from '~icons/tabler/coins'
	import FileEuro from '~icons/tabler/file-euro'
	import BasketPlus from '~icons/tabler/basket-plus'
	import Callout from '$lib/components/callout.svelte'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
</script>

<Title title="Financieel" />

<Callout type="caution">
	Ongeveer wordt niet meer gebruikt en is alleen nog beschikbaar voor historische redenen. Doe geen declaraties!
</Callout>

<h3>
	Huidig saldo:
	<span class:red={data.person.balance < new Decimal(0)} class="bold">
		{formatMoney(data.person.balance)}
	</span>
</h3>

<div class="menu">
	<a href="/financieel/consumpties" class="card">
		<ShoppingCart />
		<p>Consumpties</p>
	</a>

	<a href="/financieel/transacties" class="card">
		<Coins />
		<p>Transacties</p>
	</a>

	<a href="/financieel/declaraties" class="card">
		<FileEuro />
		<p>Declaraties</p>
	</a>

	<a href="/financieel/declaraties/indienen" class="card">
		<BasketPlus />
		<p>Declaratie indienen</p>
	</a>
</div>

<style lang="scss">
	a {
		margin: 1rem 0;
		display: block;
		width: fit-content;
	}

	.bold {
		font-weight: bold;
	}

	.red {
		color: rgb(146, 0, 0);
	}

	:global(.ibs-theme--dark) .red {
		color: red;
	}

	h3 {
		margin-top: 2rem;
		text-align: center;
	}

	.menu {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 1rem;
		width: fit-content;
		margin-left: auto;
		margin-right: auto;

		.card {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			background-color: #e4e4e4;
			border-radius: 0.5rem;
			padding: 1rem;
			font-size: 1.5rem;
			text-align: center;
			width: 100%;
			height: 100%;

			&:hover {
				background-color: #d4d4d4;
			}
		}
	}

	:global(.ibs-theme--dark) .menu .card {
		background-color: #2d2d2d;

		&:hover {
			background-color: #3d3d3d;
		}
	}
</style>

<script lang="ts">
	import { page } from '$app/stores'
	import { LDAP_IDS } from '$lib/constants'

	// import Logo from '$lib/components/logo-v2-small.svelte';
	import Calendar from '~icons/tabler/calendar-bolt'
	import InformationCircle from '~icons/tabler/info-circle'
	import Beer from '~icons/tabler/beer'
	import Users from '~icons/tabler/users'
	import PigMoney from '~icons/tabler/pig-money'
	import ShieldCheck from '~icons/tabler/shield-check'
	import Settings from '~icons/tabler/settings'
	import AccessibleOff from '~icons/tabler/accessible-off'
	import Photo from '~icons/tabler/photo'
	import Music from '~icons/tabler/music'
	import Streaming from '~icons/tabler/device-tv-old'
	import Menu from '~icons/tabler/menu-2'
	import X from '~icons/tabler/x'
	import Equal from '~icons/tabler/equal'
	import Revolut from '~icons/tabler/brand-revolut'
	import Book from '~icons/tabler/book'
	import People from '~icons/tabler/users'
	import ArrowBarRight from '~icons/tabler/arrow-bar-right'
	import ArrowBarLeft from '~icons/tabler/arrow-bar-to-left'
	import MoodDollar from '~icons/tabler/mood-dollar'
	import QuestionMark from '~icons/tabler/question-mark'
	import Home from '~icons/tabler/home'
	import ShoppingCart from '~icons/tabler/shopping-cart'
	import ListNumbers from '~icons/tabler/list-numbers'
	import OngeveerLogo from './_ongeveer-logo.svelte'
	import IbsLogo from './_ibs-logo.svelte'
	import IbsLogoDev from './_ibs-logo-dev.svelte'
	import { dev } from '$app/environment'

	export let openMenu: () => void
	export let open: boolean
	export let version: string

	$: inOngeveer = $page.url.pathname.startsWith('/ongeveer')
</script>

<nav class="layout--navbar">
	<a href={inOngeveer ? '/ongeveer' : '/'} class="logo">
		{#if dev}
			<IbsLogoDev />
		{:else if inOngeveer}
			<OngeveerLogo />
		{:else}
			<IbsLogo />
		{/if}
	</a>

	<hr />

	{#if inOngeveer}
		<a href="/" class="layout--navbar--item">
			<i><Home /></i>
			<span>IBS</span>
		</a>
		<a href="/ongeveer/bank" class="layout--navbar--item">
			<i><Revolut /></i>
			<span>Bank</span>
		</a>
		<a href="/ongeveer/saldo" class="layout--navbar--item">
			<i><MoodDollar /></i>
			<span>Saldo</span>
		</a>
		<a href="/ongeveer/purchases" class="layout--navbar--item">
			<i><ArrowBarLeft /></i>
			<span>Inkoop</span>
		</a>
		<button class="layout--navbar--item btn-a" on:click={openMenu}>
			{#if open}
				<i><X /></i>
			{:else}
				<i><Menu /></i>
			{/if}
			<span>Menu</span>
		</button>
		<a href="/ongeveer/sales" class="layout--navbar--item">
			<i><ArrowBarRight /></i>
			<span>Verkoop</span>
		</a>
		<a href="/ongeveer/ledger" class="layout--navbar--item">
			<i><Book /></i>
			<span>Grootboekrekeningen</span>
		</a>
		<a href="/ongeveer/relations" class="layout--navbar--item">
			<i><People /></i>
			<span>Relaties</span>
		</a>
		<a href="/ongeveer/products" class="layout--navbar--item">
			<i><ShoppingCart /></i>
			<span>Producten</span>
		</a>
		<a href="/ongeveer/help" class="layout--navbar--item">
			<i><QuestionMark /></i>
			<span>Hulp</span>
		</a>
	{:else}
		<a class="layout--navbar--item" href="/kalender">
			<i><Calendar /></i>
			<span>Kalender</span>
		</a>

		<a class="layout--navbar--item" href="/ranglijst">
			<i><ListNumbers /></i>
			<span>Ranglijsten</span>
		</a>

		<a class="layout--navbar--item" href="/strafbakken">
			<i><Beer /></i>
			<span>Strafbakken</span>
		</a>
		<a class="layout--navbar--item" href="/fotos">
			<i><Photo /></i>
			<span>Foto's</span>
		</a>

		<button class="layout--navbar--item btn-a" on:click={openMenu}>
			{#if open}
				<i><X /></i>
			{:else}
				<i><Menu /></i>
			{/if}
			<span>Menu</span>
		</button>

		<a class="layout--navbar--item" href="/playlist">
			<i><Music /></i>
			<span>Playlist</span>
		</a>

		<a class="layout--navbar--item" href="/streaming">
			<i><Streaming /></i>
			<span>Streaming</span>
		</a>

		{#if $page.data?.settings.maluspuntenEnabled}
			<a class="layout--navbar--item" href="/maluspunten">
				<i><AccessibleOff /></i>
				<span>Maluspunten</span>
			</a>
		{/if}

		<a class="layout--navbar--item" href="/financieel">
			<i><PigMoney /></i>
			<span>Financieel</span>
		</a>
		<a class="layout--navbar--item" href="/leden">
			<i><Users /></i>
			<span>Leden</span>
		</a>
		<a class="layout--navbar--item" href="/instellingen">
			<i><Settings /></i>
			<span>Instellingen</span>
		</a>
		{#if $page.data.roles[LDAP_IDS.ADMINS] || $page.data.roles[LDAP_IDS.SENAAT]}
			<a class="layout--navbar--item" href="/admin">
				<i><ShieldCheck /></i>
				<span>Admin</span>
			</a>
		{/if}
		{#if $page.data.roles[LDAP_IDS.ADMINS] || $page.data.roles[LDAP_IDS.SENAAT] || $page.data.roles[LDAP_IDS.FINANCIE]}
			<a class="layout--navbar--item" href="/ongeveer">
				<i><Equal /></i>
				<span>Ongeveer</span>
			</a>
		{/if}
	{/if}

	<a class="layout--navbar--item version" href="/over">
		<i><InformationCircle /></i>
		<span>IBS v{version}</span>
	</a>
</nav>

<style lang="scss">
	.logo {
		display: flex;
		justify-content: center;
		align-items: center;

		& :global(svg) {
			width: 100%;
			height: 100%;
			margin: 0 1rem;
			fill: none;
		}

		:global(.fill-logo) {
			fill: var(--color-logo);
		}

		:global(.stroke-logo) {
			stroke: var(--color-logo);
		}
	}

	.version {
		margin-top: auto;
	}

	@media (max-width: 600px) {
		.logo {
			display: none;
		}

		.layout--navbar--item {
			& > span {
				display: none;
			}
		}

		hr {
			display: none;
		}
	}
</style>

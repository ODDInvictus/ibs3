<script lang="ts">
	import { page } from '$app/state'
	import { LDAP_IDS } from '$lib/constants'
	import InformationCircle from '~icons/tabler/info-circle'
	import Users from '~icons/tabler/users'
	import PigMoney from '~icons/tabler/pig-money'
	import ShieldCheck from '~icons/tabler/shield-check'
	import Streaming from '~icons/tabler/device-tv-old'
	import Settings from '~icons/tabler/settings'
	import AccessibleOff from '~icons/tabler/accessible-off'
	import Equal from '~icons/tabler/equal'
	import ArrowBarRight from '~icons/tabler/arrow-bar-right'
	import Book from '~icons/tabler/book'
	import People from '~icons/tabler/users'
	import ShoppingCart from '~icons/tabler/shopping-cart'
	import QuestionMark from '~icons/tabler/question-mark'
	import Music from '~icons/tabler/music'

	interface Props {
		version: string
	}

	let { version }: Props = $props()
	let inOngeveer = $derived(page.url.pathname.startsWith('/ongeveer'))
</script>

<div class="inner">
	{#if inOngeveer}
		<a href="/ongeveer/sales" class="layout--mobimenu--item">
			<i><ArrowBarRight /></i>
			<span>Verkoop</span>
		</a>
		<a href="/ongeveer/ledger" class="layout--mobimenu--item">
			<i><Book /></i>
			<span>Grootboekrekeningen</span>
		</a>
		<a href="/ongeveer/relations" class="layout--mobimenu--item">
			<i><People /></i>
			<span>Relaties</span>
		</a>
		<a href="/ongeveer/products" class="layout--mobimenu--item">
			<i><ShoppingCart /></i>
			<span>Producten</span>
		</a>
		<a href="/ongeveer/help" class="layout--mobimenu--item">
			<i><QuestionMark /></i>
			<span>Hulp</span>
		</a>
	{:else}
		<!-- <a class="layout--mobimenu--item" href="/playlist">
			<i><Music /></i>
			<span>Playlist</span>
		</a> -->

		<a class="layout--mobimenu--item" href="/streaming">
			<i><Streaming /></i>
			<span>Streaming</span>
		</a>

		{#if page.data.settings.maluspuntenEnabled}
			<a class="layout--mobimenu--item" href="/maluspunten">
				<i><AccessibleOff /></i>
				<span>Maluspunten</span>
			</a>
		{/if}

		{#if page.data.roles[LDAP_IDS.ADMINS] || page.data.roles[LDAP_IDS.SENAAT]}
			<a class="layout--mobimenu--item" href="/admin">
				<i><ShieldCheck /></i>
				<span>Admin</span>
			</a>
		{/if}

		<a class="layout--mobimenu--item" href="/financieel">
			<i><PigMoney /></i>
			<span>Financieel</span>
		</a>

		<a class="layout--mobimenu--item" href="/instellingen">
			<i><Settings /></i>
			<span>Instellingen</span>
		</a>

		<a class="layout--mobimenu--item" href="/leden">
			<i><Users /></i>
			<span>Leden</span>
		</a>

		<a class="layout--mobimenu--item" href="/ongeveer">
			<i><Equal /></i>
			<span>Ongeveer</span>
		</a>

		<a class="layout--mobimenu--item version" href="/over">
			<i><InformationCircle /></i>
			<span>IBS v{version}</span>
		</a>
	{/if}
</div>

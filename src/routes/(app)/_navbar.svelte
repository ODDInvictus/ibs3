<script lang="ts">
	import { page } from '$app/stores';
	import { LDAP_IDS } from '$lib/constants';

	import { env } from '$env/dynamic/public';
	import Logo from '$lib/components/logo-v2-small.svelte';
	import Calendar from '~icons/tabler/calendar-bolt';
	import InformationCircle from '~icons/tabler/info-circle';
	import Beer from '~icons/tabler/beer';
	import Users from '~icons/tabler/users';
	import PigMoney from '~icons/tabler/pig-money';
	import ShieldCheck from '~icons/tabler/shield-check';
	import Settings from '~icons/tabler/settings';
	import AccessibleOff from '~icons/tabler/accessible-off';
</script>

<nav class="layout--navbar">
	<div class="logo">
		<Logo />
	</div>

	<hr />

	<a class="layout--navbar--item" href="/kalender">
		<i><Calendar /></i>
		Kalender
	</a>
	<a class="layout--navbar--item" href="/strafbakken">
		<i><Beer /></i>
		Strafbakken
	</a>
	<a class="layout--navbar--item" href="/financieel">
		<i><PigMoney /></i>
		Financieel
	</a>
	{#if !$page.data.roles[LDAP_IDS.FEUTEN]}
		<a class="layout--navbar--item" href="/maluspunten">
			<i><AccessibleOff /></i>
			Maluspunten
		</a>
	{/if}
	<a class="layout--navbar--item" href="/leden">
		<i><Users /></i>
		Leden
	</a>
	<a class="layout--navbar--item" href="/instellingen">
		<i><Settings /></i>
		Instellingen
	</a>
	{#if $page.data.roles[LDAP_IDS.ADMINS] || $page.data.roles[LDAP_IDS.SENAAT]}
		<a class="layout--navbar--item" href="/admin">
			<i><ShieldCheck /></i>
			Admin
		</a>
	{/if}

	<a class="layout--navbar--item version" href="/over">
		<i><InformationCircle /></i>
		IBS v{env.PUBLIC_VERSION}
	</a>
</nav>

<style lang="scss">
	.layout--navbar {
		display: flex;
		flex-direction: column;
		text-align: start;
	}

	.logo {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.logo :global(svg) {
		width: 100%;
		height: 100%;
		margin: 0 1rem;
	}

	.version {
		margin-top: auto;
	}
</style>

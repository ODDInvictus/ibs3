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
	<Logo />

	<hr />

	<div class="nav-item">
		<a href="/kalender">
			<i><Calendar /></i>
			Kalender
		</a>
	</div>
	<div class="nav-item">
		<a href="/strafbakken">
			<i><Beer /></i>
			Strafbakken
		</a>
	</div>
	<div class="nav-item">
		<a href="/financieel">
			<i><PigMoney /></i>
			Financieel
		</a>
	</div>
	{#if !$page.data.roles[LDAP_IDS.FEUTEN]}
		<div class="nav-item">
			<a href="/maluspunten">
				<i><AccessibleOff /></i>
				Maluspunten
			</a>
		</div>
	{/if}
	<div class="nav-item">
		<a href="/leden">
			<i><Users /></i>
			Leden
		</a>
	</div>
	<div class="nav-item">
		<a href="/instellingen">
			<i><Settings /></i>
			Instellingen
		</a>
	</div>
	{#if $page.data.roles[LDAP_IDS.ADMINS] || $page.data.roles[LDAP_IDS.SENAAT]}
		<div class="nav-item">
			<a href="/admin">
				<i><ShieldCheck /></i>
				Admin
			</a>
		</div>
	{/if}

	<div class="nav-item version">
		<a href="/over">
			<i><InformationCircle /></i>
			IBS v{env.PUBLIC_VERSION}
		</a>
	</div>
</nav>

<style lang="scss">
	.layout--navbar {
		display: flex;
		flex-direction: column;
		text-align: start;
	}

	.nav-item {
		margin: 0.5rem 2rem;
	}

	.version {
		margin-top: auto;
		margin-bottom: 1rem;
	}
</style>

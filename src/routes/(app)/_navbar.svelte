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
	import Photo from '~icons/tabler/photo';
</script>

<nav class="layout--navbar">
	<a href="/" class="logo">
		<Logo />
	</a>

	<hr />

	<a class="layout--navbar--item" href="/kalender">
		<i><Calendar /></i>
		<span>Kalender</span>
	</a>
	<a class="layout--navbar--item" href="/strafbakken">
		<i><Beer /></i>
		<span>Strafbakken</span>
	</a>
	<a class="layout--navbar--item" href="/fotos">
		<i><Photo /></i>
		<span>Foto's</span>
	</a>
	{#if !$page.data.roles[LDAP_IDS.FEUTEN]}
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

	<a class="layout--navbar--item version" href="/over">
		<i><InformationCircle /></i>
		<span>IBS v{env.PUBLIC_VERSION}</span>
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

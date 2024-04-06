<script lang="ts">
	import { page } from '$app/stores'
	import { LDAP_IDS } from '$lib/constants'
	import { env } from '$env/dynamic/public'
	import InformationCircle from '~icons/tabler/info-circle'
	import Users from '~icons/tabler/users'
	import PigMoney from '~icons/tabler/pig-money'
	import ShieldCheck from '~icons/tabler/shield-check'
	import Settings from '~icons/tabler/settings'
	import AccessibleOff from '~icons/tabler/accessible-off'
</script>

<div class="inner">
	{#if !$page.data.roles[LDAP_IDS.FEUTEN]}
		<a class="layout--mobimenu--item" href="/maluspunten">
			<i><AccessibleOff /></i>
			<span>Maluspunten</span>
		</a>
	{/if}

	{#if $page.data.roles[LDAP_IDS.ADMINS] || $page.data.roles[LDAP_IDS.SENAAT]}
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

	<a class="layout--mobimenu--item version" href="/over">
		<i><InformationCircle /></i>
		<span>IBS v{env.PUBLIC_VERSION}</span>
	</a>
</div>

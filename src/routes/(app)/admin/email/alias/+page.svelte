<script lang="ts">
	import { page } from '$app/stores';
	import Edit from '~icons/tabler/edit';
	import CircleX from '~icons/tabler/circle-x';
	import InfoCircle from '~icons/tabler/info-circle';
	import { toast } from '$lib/notification';

	console.log($page.data.customAliases);

	const domain = $page.data.domain;

	function info() {
		toast({
			title: 'Niks aan te doen',
			message:
				'Deze worden automatisch aangemaakt voor commissies. Deze aliassen zijn niet te verwijderen.',
			type: 'info'
		});
	}

	function deleteAlias(id: number) {
		toast({
			title: 'Weet je het zeker?',
			message: 'Als je het echt wil verwijderen klik dan nog een keer op deze knop.',
			type: 'warning'
		});
	}

	function editAlias(id: number) {
		toast({
			title: 'Oei!',
			message: 'Dit is nog niet geimplementeerd lmao.',
			type: 'error'
		});
	}
</script>

<h1>Email aliassen</h1>

<hr />

<table>
	<thead>
		<tr>
			<th>Naam</th>
			<th>Alias</th>
			<th>Opties</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td class="bold"> Persoonlijke aliassen </td>
			<td />
			<td />
		</tr>

		{#each $page.data.userAliases as alias}
			<tr>
				<td>
					<a href="/leden/{alias.user.ldapId}">
						{alias.user.firstName}
						{alias.user.lastName}
						{#if alias.user.nickname}
							({alias.user.nickname})
						{/if}
					</a>
				</td>
				<td>
					<a href="/admin/email/alias/{alias.alias.id}">
						{alias.alias.alias}@{domain}
					</a>
				</td>
				<td>
					<div class="options">
						<button on:click={() => editAlias(alias.alias.id)}>
							<Edit />
						</button>
						<button on:click={() => deleteAlias(alias.alias.id)}>
							<CircleX />
						</button>
					</div>
				</td>
			</tr>
		{/each}

		<tr>
			<td class="bold"> Losse aliassen </td>
			<td />
			<td />
		</tr>

		{#each $page.data.customAliases as alias}
			<tr>
				<td>
					{alias.address}
				</td>
				<td>
					<a href="/admin/email/alias/{alias.id}">
						{alias.EmailAlias.alias}@{domain}
					</a>
				</td>
				<td>
					<div class="options">
						<button on:click={() => editAlias(alias.id)}>
							<Edit />
						</button>
						<button on:click={() => deleteAlias(alias.id)}>
							<CircleX />
						</button>
					</div>
				</td>
			</tr>
		{/each}

		<tr>
			<td class="bold"> Commissie aliassen </td>
			<td />
			<td />
		</tr>

		{#each $page.data.committeeAliases as alias}
			<tr>
				<td>
					<a href="/leden/commissie/{alias.committee.ldapId}">
						{alias.committee.name}
					</a>
				</td>
				<td>
					<a href="/admin/email/alias/{alias.alias.id}">
						{alias.alias.alias}@{domain}
					</a>
				</td>
				<td>
					<button on:click={info}>
						<InfoCircle />
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<br />
<br />
<br />

<style lang="scss">
	h1 {
		text-align: center;
	}

	hr {
		margin: 0.5rem 0;
	}

	a {
		color: var(--primary-color);
	}

	.bold {
		font-weight: bold;
	}

	.options {
		display: flex;
		justify-content: flex-start;
		gap: 0.5rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;

		thead {
			font-size: 1.1rem;
		}

		th,
		td {
			text-align: left;
		}
	}
</style>

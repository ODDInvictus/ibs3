<script lang="ts">
	import { page } from '$app/stores'
	import Edit from '~icons/tabler/edit'
	import CircleX from '~icons/tabler/circle-x'
	import InfoCircle from '~icons/tabler/info-circle'
	import Send from '~icons/tabler/send'
	import { toast } from '$lib/notification'
	import { confirm } from '$lib/confirm'
	import { goto } from '$app/navigation'
	import MailPlus from '~icons/tabler/mail-plus'
	import Title from '$lib/components/title.svelte'

	const domain = $page.data.domain

	function info() {
		toast({
			title: 'Niks aan te doen',
			message: 'Deze worden automatisch aangemaakt voor commissies. Deze aliassen zijn niet te verwijderen.',
			type: 'info',
		})
	}

	function userInfo() {
		toast({
			title: 'Niks aan te doen',
			message: 'Dit zijn de email adressen van de leden. Deze zijn niet te verwijderen.',
			type: 'info',
		})
	}

	function deleteAlias(id: number) {
		confirm({
			title: 'Weet je het zeker?',
			message: 'Dit kan niet ongedaan worden!',
			cb: async (success: boolean) => {
				if (success) {
					await fetch(location.pathname + '?id=' + id, {
						method: 'DELETE',
					}).then(async res => {
						const obj = await res.json()
						if (res.ok) {
							toast({
								title: 'Gelukt!',
								message: obj.message,
								type: 'success',
							})
							location.reload()
						} else {
							toast({
								title: 'Oei!',
								message: obj.message,
								type: 'danger',
							})
						}
					})
				}
			},
		})
	}

	function editAlias(id: number) {
		goto('/admin/email/alias/' + id)
	}

	function sendMail(alias: string) {
		goto('/admin/email/stuur/' + alias)
	}
</script>

<Title title="Email aliassen" />

<p>Welkom op de alias pagina! Alle acties die hier ondernomen worden worden binnen 24 uur verwerkt door de backend.</p>

<div class="table-wrapper">
	<table class="small">
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
				<td>
					<div class="options">
						<button class="btn-a" on:click={() => goto('/admin/email/alias/nieuw/persoonlijk')}>
							<MailPlus />
						</button>
					</div>
				</td>
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
							<button class="btn-a" on:click={() => editAlias(alias.alias.id)}>
								<Edit />
							</button>
							<button class="btn-a" on:click={() => deleteAlias(alias.alias.id)}>
								<CircleX />
							</button>
							<button class="btn-a" on:click={() => sendMail(alias.alias.alias)}>
								<Send />
							</button>
						</div>
					</td>
				</tr>
			{/each}

			<tr>
				<td class="bold"> Losse aliassen </td>
				<td />
				<td>
					<div class="options">
						<button class="btn-a" on:click={() => goto('/admin/email/alias/nieuw/custom')}>
							<MailPlus />
						</button>
					</div>
				</td>
			</tr>

			{#each $page.data.customAliases as alias}
				<tr>
					<td>
						{alias.address}
					</td>
					<td>
						<a href="/admin/email/alias/{alias.emailAliasId}">
							{alias.EmailAlias.alias}@{domain}
						</a>
					</td>
					<td>
						<div class="options">
							<button class="btn-a" on:click={() => editAlias(alias.emailAliasId)}>
								<Edit />
							</button>
							<button class="btn-a" on:click={() => deleteAlias(alias.emailAliasId)}>
								<CircleX />
							</button>
							<button class="btn-a" on:click={() => sendMail(alias.alias.alias)}>
								<Send />
							</button>
						</div>
					</td>
				</tr>
			{/each}

			<tr>
				<td class="bold"> Gebruikers </td>
				<td />
				<td>
					<div class="options">
						<button class="btn-a" on:click={userInfo}>
							<InfoCircle />
						</button>
					</div>
				</td>
			</tr>

			{#each $page.data.users as alias}
				<tr>
					<td>
						<a href="/leden/{alias.ldapId}">
							{alias.firstName}
							{alias.lastName}
							{#if alias.nickname}
								({alias.nickname})
							{/if}
						</a>
					</td>
					<td>
						{alias.email}
					</td>
					<td>
						<div class="options">
							<button class="btn-a" on:click={() => sendMail(alias.ldapId)}>
								<Send />
							</button>
						</div>
					</td>
				</tr>
			{/each}

			<tr>
				<td class="bold"> Commissie aliassen </td>
				<td />
				<td>
					<div class="options">
						<button class="btn-a" on:click={() => goto('/admin/commissie')}>
							<MailPlus />
						</button>
					</div>
				</td>
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
						<button class="btn-a" on:click={info}>
							<InfoCircle />
						</button>
						<button class="btn-a" on:click={() => sendMail(alias.alias.alias)}>
							<Send />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<br />
<br />
<br />

<style lang="scss">
	.bold {
		font-weight: bold;
	}

	.options {
		display: flex;
		justify-content: flex-start;
		gap: 0.5rem;
	}

	.table-wrapper {
		overflow-x: scroll;
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

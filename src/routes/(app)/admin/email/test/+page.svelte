<script lang="ts">
	import Title from '$lib/components/title.svelte'
	import Send from '~icons/tabler/send'
	import type { PageData } from './$types'
	import { toast } from '$lib/notification'

	export let data: PageData

	let activity = data.aliases.activities[0].id
	let userStrafbakken = data.aliases.users[0].ldapId
	let userPersonalEmail = data.aliases.users[0].ldapId

	async function send(alias: string) {
		let parameter: any = -1

		switch (alias) {
			case 'new-activity':
				parameter = activity
				break
			case 'personal-emails':
				parameter = userPersonalEmail
				break
			case 'no-strafbakken':
				parameter = userStrafbakken
				break
			default:
				break
		}

		return await fetch(location.href, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				alias,
				parameter,
			}),
		})
			.then(async res => {
				if (!res.ok) {
					toast({
						title: 'Oei',
						message: await res.text(),
						type: 'danger',
					})
				} else {
					toast({
						title: 'Success',
						message: 'Email(s) verzonden',
						type: 'success',
					})
				}
			})
			.catch(err => {
				console.error(err)
				toast({
					title: 'Oei',
					message: err,
					type: 'danger',
				})
			})
	}
</script>

<Title title="Email tester" />

<p>Op deze pagina kan je email templates testen. Dit hoor je niet te zien op de live server!</p>

<div class="table-wrapper">
	<table>
		<thead>
			<tr>
				<th>Template</th>
				<th>Parameter</th>
				<th>Stuur</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="bold">Nieuwe activiteit</td>
				<td>
					<select name="activity" bind:value={activity}>
						{#each data.aliases.activities as activity}
							<option value={activity.id}>{activity.name} ({activity.id})</option>
						{/each}
					</select>
				</td>
				<td>
					<div class="options">
						<button class="btn-a" on:click={() => send('new-activity')}>
							<Send />
						</button>
					</div>
				</td>
			</tr>
			<tr>
				<td class="bold">Geen persoonlijke emails</td>
				<td>
					<select name="personal-emails" bind:value={userPersonalEmail}>
						{#each data.aliases.users as user}
							<option value={user.ldapId}>{user.firstName}</option>
						{/each}
					</select>
				</td>
				<td>
					<div class="options">
						<button class="btn-a" on:click={() => send('no-personal-emails')}>
							<Send />
						</button>
					</div>
				</td>
			</tr>
			<tr>
				<td class="bold">Strafbakken verdubbeld</td>
				<td> </td>
				<td>
					<div class="options">
						<button class="btn-a" on:click={() => send('strafbakken-doubled')}>
							<Send />
						</button>
					</div>
				</td>
			</tr>
			<tr>
				<td class="bold">Geen strafbakken</td>
				<td>
					<select name="no-strafbakken" bind:value={userStrafbakken}>
						{#each data.aliases.users as user}
							<option value={user.ldapId}>{user.firstName}</option>
						{/each}
					</select>
				</td>
				<td>
					<div class="options">
						<button class="btn-a" on:click={() => send('no-strafbakken')}>
							<Send />
						</button>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
</div>

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

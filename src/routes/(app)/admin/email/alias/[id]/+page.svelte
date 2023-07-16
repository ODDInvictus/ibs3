<script lang="ts">
	import { page } from '$app/stores';
	import { toast } from '$lib/notification';
	import { prompt } from '$lib/prompt';
	import { promptSelect } from '$lib/promptSelect';
	import Edit from '~icons/tabler/edit';

	const alias = $page.data.alias;
	console.log(alias);

	function edit() {
		prompt({
			title: 'Bewerk alias',
			message: 'Vul hier een geldig email adres in om de alias te veranderen',
			cb: async (value: string) => {
				// First check if the value is an email address
				const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				const match = re.test(value);

				if (!match) {
					return toast({
						title: 'Oei!',
						message: `${value} is geen geldig email adres`,
						type: 'error'
					});
				}

				// Now we can tell the server to change the alias
				await ajax({
					id: alias.id,
					type: 'custom',
					address: value
				});
			}
		});
	}

	function editUser() {
		let users = $page.data.users.map((u: any) => {
			return {
				name: `${u.firstName} ${u.lastName} (${u.email})`,
				id: u.id
			};
		});

		promptSelect({
			title: 'Bewerk alias',
			message: 'Vul hier een geldig email adres in om de alias te veranderen',
			options: users.map((u: any) => u.name),
			cb: async (value: string) => {
				if (!value)
					return toast({
						title: 'Oei!',
						message: 'Geen gebruiker geselecteerd',
						type: 'error'
					});

				// Now get the ID
				const uid = users.find((u: any) => u.name === value).id;

				// Now we can tell the server to change the alias
				await ajax({
					id: alias.id,
					type: 'user',
					uid
				});
			}
		});
	}

	async function ajax(body: any) {
		await fetch('', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}).then(async (res) => {
			const obj = await res.json();
			if (res.ok) {
				location.reload();
			} else {
				toast({
					title: 'Oei!',
					message: obj.message,
					type: 'error'
				});
			}
		});
	}
</script>

<h1>{alias.alias}@{$page.data.domain}</h1>

<hr />

<p><span>Alias type:</span> {$page.data.type}</p>

{#if $page.data.type == 'custom'}
	<div class="receiver">
		<div>
			<span>Wordt ontvangen door:</span>
			{alias.EmailContact[0].address}
		</div>

		<div class="button">
			<button on:click={edit}>
				<Edit />
			</button>
		</div>
	</div>
{:else if $page.data.type == 'committee'}
	{#each alias.EmailAliasCommittee[0].committee.CommitteeMember as member}
		<p><span>Ontvanger: </span>{member.member.email}</p>
	{/each}
	<br />

	Deze lijst aanpassen? Ga naar <a href="/admin/committees">de Commissie pagina</a>

	<br />
	<br />
{:else if $page.data.type == 'user'}
	{@const u = alias.EmailAliasUser[0].user}
	<div class="receiver">
		<div>
			<span>Wordt ontvangen door:</span>
			<a href="/leden/{u.ldapId}">
				{u.firstName}
				{u.lastName}
				({u.email})
			</a>
		</div>

		<div class="button">
			<button on:click={edit}>
				<Edit />
			</button>
		</div>
	</div>
{/if}
<a href="/admin/email/alias"> Terug </a>

<style lang="scss">
	h1 {
		text-align: center;
	}

	a {
		color: var(--primary-color);
	}

	hr {
		margin: 0.5rem 0;
	}

	span {
		font-weight: bold;
	}

	.receiver {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 0.25rem;
	}

	.button {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>

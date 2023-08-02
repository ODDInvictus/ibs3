<script lang="ts">
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';
	import { toast } from '$lib/notification';

	let user = -1;
	let alias = '';

	async function submit() {
		await fetch('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ user, alias })
		})
			.then((b) => b.json())
			.then((res) => {
				if (res.success) {
					toast({
						title: 'Gelukt!',
						message: res.message,
						type: 'success'
					});
					setTimeout(() => {
						location.href = '/admin/email/alias';
					}, 3000);
				} else {
					toast({
						title: 'Oei!',
						message: res.message,
						type: 'danger'
					});
				}
			});
	}
</script>

<Title title="Nieuwe persoonlijke alias" shortTitle="Persoonlijke alias" />

<p>
	Op deze pagina kan je een nieuwe persoonlijke alias maken. Deze alias mapt dan van een IBS
	gebruiker naar een @{$page.data.domain} email adres.
</p>

<form id="new-alias-form">
	<label for="alias">Alias</label>
	<div>
		<input bind:value={alias} type="text" id="alias" name="alias" />
		@{$page.data.domain}
	</div>

	<label for="user">Gebruiker</label>
	<select name="user" bind:value={user}>
		{#each $page.data.users as user}
			<option value={user.id}>{user.firstName} {user.lastName} ({user.ldapId})</option>
		{/each}
	</select>

	<button on:click={submit}>Verstuur</button>
</form>

<style lang="scss">
	form {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: 100px 1fr;
		gap: 1rem;

		@media (max-width: 640px) {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}

		label {
			font-weight: 600;
			padding-top: 0.4rem;
		}

		input:not([type='file']) {
			padding: 0.5rem;
			border: 1px solid #ccc;
			border-radius: 5px;
			outline: none;
		}

		input:focus:not([type='file']) {
			border: 1px solid purple;
		}
	}
</style>

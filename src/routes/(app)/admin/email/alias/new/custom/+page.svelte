<script lang="ts">
	import { page } from '$app/stores';
	import { toast } from '$lib/notification';

	let email = '';
	let alias = '';

	async function submit() {
		await fetch('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, alias })
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
						type: 'error'
					});
				}
			});
	}
</script>

<h1>Nieuwe custom alias</h1>

<hr />

<p>
	Op deze pagina kan je een nieuwe custom alias maken, dit is om een <b>niet</b>
	{$page.data.domain} email te linken aan een gmail account o.i.d
</p>
<p>Denk bijvoorbeeld aan stin@</p>

<form id="new-alias-form">
	<label for="alias">Alias</label>
	<div>
		<input bind:value={alias} type="text" id="alias" name="alias" />
		@{$page.data.domain}
	</div>

	<label for="email">Email</label>
	<input bind:value={email} type="text" id="email" name="email" />

	<button on:click={submit}>Verstuur</button>
</form>

<style lang="scss">
	h1 {
		text-align: center;
	}

	hr {
		margin: 0.5rem 0;
	}

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

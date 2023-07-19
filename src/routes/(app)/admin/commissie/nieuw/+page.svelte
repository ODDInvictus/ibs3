<script lang="ts">
	import { page } from '$app/stores';
	import { toast } from '$lib/notification';
	import Help from '~icons/tabler/help';

	let name = '';
	let ldapId = '';

	async function create() {
		const res = await fetch('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, ldapId })
		});

		const data = await res.json();

		if (res.ok) {
			toast({
				title: 'Commissie aangemaakt',
				message: `De commissie is successvol aangemaakt. Je wordt zo doorgestuurd naar de commissie pagina`,
				type: 'success'
			});

			setTimeout(() => {
				window.location.href = `/admin/commissie`;
			}, 1500);
		} else {
			toast({
				title: 'Oei!',
				message: `Er is iets misgegaan: ${data.message}`,
				type: 'error'
			});
		}
	}
</script>

<h1>Commissie beheer</h1>

<hr />

<p>Maak een nieuwe commissie aan</p>

<br />

<label for="name">Naam</label>
<input type="text" name="name" id="name" placeholder="De Bakkentrekkers" bind:value={name} />

<br />

<div class="ldapId">
	<label for="ldapId">ldapId</label>
	<div
		title="Dit is de interne id van de commissie, dus ook wat het email adres wordt. Denk aan `senaat` of `leden`"
	>
		<Help />
	</div>
</div>
<input type="text" name="ldapId" id="ldapId" placeholder="bakkentrekkers" bind:value={ldapId} />

<button on:click={create}>Maak commissie aan</button>

<style lang="scss">
	h1 {
		text-align: center;
	}

	hr {
		margin: 0.5rem 0;
	}

	label {
		display: block;
		font-weight: 600;
	}

	input {
		display: block;
		width: 100%;
	}

	.ldapId {
		display: flex;
		gap: 0.2rem;
	}

	button {
		margin-top: 1rem;
	}
</style>

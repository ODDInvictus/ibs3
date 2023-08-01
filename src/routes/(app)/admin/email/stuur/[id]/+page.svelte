<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Title from '$lib/components/title.svelte';
	import { toast } from '$lib/notification';
</script>

<Title
	title="Email versturen"
	underTitle="Hier kan je een email versturen naar het door jou geselecteerde adres"
/>

<form
	method="POST"
	use:enhance={() => {
		return async ({ result }) => {
			console.log(result);
			if (result.data?.success) {
				toast({
					title: 'Email verstuurd',
					message: 'De email is succesvol verstuurd. Je wordt zo teruggestuurd',
					type: 'success'
				});
				setTimeout(() => {
					window.location.href = '/admin/email/alias';
				}, 1000);
			} else {
				toast({
					title: 'Oeps',
					message: result.data.message,
					type: 'danger'
				});
			}
		};
	}}
>
	<label class="label" for="subject">Onderwerp</label>
	<input type="text" name="subject" id="subject" required />

	<label class="label" for="message">Bericht</label>
	<textarea name="message" id="message" required />

	<label class="label" for="sender">Verstuur-adres</label>
	<select name="sender" required>
		{#each $page.data.aliases as alias}
			<option value={alias}>{alias}</option>
		{/each}
	</select>

	<label class="label" for="toName">Naam ontvanger(s)</label>
	<input type="text" name="toName" id="toName" required />

	<p class="label">Aan</p>
	<p>{$page.data.to}</p>

	<button type="submit">Verstuur</button>
</form>

<style lang="scss">
	form {
		display: grid;
		grid-template-columns: 150px 1fr;
		grid-gap: 1rem;
		margin-top: 1rem;
	}

	input {
		width: 100%;
		border: 1px solid var(--border-color);
		border-radius: 5px;
	}

	.label {
		font-weight: 600;
	}
</style>

<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import Title from '$lib/components/title.svelte'
	import { toast } from '$lib/notification'
</script>

<Title title="Email versturen" underTitle="Hier kan je een email versturen naar het door jou geselecteerde adres" />

<form
	class="form-group"
	id="send-email-form"
	method="POST"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.data?.success) {
				toast({
					title: 'Email verstuurd',
					message: 'De email is succesvol verstuurd. Je wordt zo teruggestuurd',
					type: 'success',
				})
				setTimeout(() => {
					window.location.href = '/admin/email/alias'
				}, 1000)
			} else {
				toast({
					title: 'Oeps',
					message: result.data.message,
					type: 'danger',
				})
			}
		}
	}}>
	<div class="form-control">
		<label class="label" for="subject">Onderwerp</label>
		<input type="text" name="subject" id="subject" required />
	</div>

	<div class="form-control">
		<label class="label" for="message">Bericht</label>
		<textarea name="message" id="message" required></textarea>
	</div>

	<div class="form-control">
		<label class="label" for="sender">Verstuur-adres</label>
		<select name="sender" required>
			{#each page.data.aliases as alias}
				<option value={alias}>{alias}</option>
			{/each}
		</select>
	</div>

	<div class="form-control">
		<label class="label" for="toName">Naam ontvanger(s)</label>
		<input type="text" name="toName" id="toName" required />
	</div>

	<!-- <div class="form-control">
		<p class="label">Aan</p>
		<p>{page.data.to}</p>
	</div> -->

	<button type="submit">Verstuur</button>
</form>

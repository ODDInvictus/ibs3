<script lang="ts">
	import { enhance } from '$app/forms'
	import type { Field, FieldType } from './form-generator'
	import { confirm } from '$lib/confirm'
	import { toast } from '$lib/notification'
	import Title from '$lib/components/title.svelte'
	import FieldComponent from './_field.svelte'
	import Label from './_label.svelte'

	interface Props {
		title: string
		shortTitle: string | undefined
		description: string
		fields: Field<FieldType>[]
		submitStr?: string
		formId?: string
		needsConfirmation: boolean
		confirmText?: string
	}

	let {
		title,
		shortTitle,
		description,
		fields,
		submitStr = 'Verstuur',
		formId = 'custom-form',
		needsConfirmation,
		confirmText = 'Weet je zeker dat je deze actie wilt uitvoeren?',
	}: Props = $props()

	let form: HTMLFormElement = $state()
	let generalError = $state('')

	function updateErrors(errors: { field?: string; message: string }[]) {
		const fields = form.querySelectorAll('.form-control')

		// Loop over all fields
		// data-name is the name of the field

		fields.forEach(field => {
			const name = field.getAttribute('data-name')!
			const type = field.getAttribute('data-type')!

			// TODO errors in table
			if (type === 'table') return

			// Find the error message for this field
			const error = errors.find(e => e.field === name)

			// Now the error element
			const errorElement = field.querySelector('.form-error')!

			// select element where name=name
			const input = field.querySelector(`[name="${name}"]`)!

			// If there is an error, show it
			if (error) {
				input.classList.add('has-error')
				errorElement.textContent = error.message
			} else {
				input.classList.remove('has-error')
				errorElement.textContent = ''
			}
		})

		// If there is a general error, show it
		const general = errors.find(e => !e.field)
		if (general) {
			generalError = general.message
		} else {
			generalError = ''
		}
	}

	async function enhanceForm({ cancel }: { cancel: () => void; formData: any }) {
		// First check if needsConfirmation is true
		let confirmed = false

		if (needsConfirmation) {
			// If so, we need to show a confirmation dialog
			confirm({
				title: 'Weet je het zeker?',
				message: confirmText,
				cb: success => {
					if (!success) cancel()
					else confirmed = true
				},
			})
		} else {
			confirmed = true
		}

		while (!confirmed) {
			// sleep(50)
			await new Promise(resolve => setTimeout(resolve, 50))
		}

		return async ({ result }: any) => {
			if (result.type === 'failure') {
				// We know now that we have data.errors
				const errors = result.data?.errors
				const msg = result.data?.message

				// We can now update the form with the errors
				if (errors && errors.length > 0) updateErrors(errors)
				if (msg) {
					toast({
						title: 'Oei!',
						message: msg,
						type: 'danger',
					})
				}
			} else if (result.type === 'success') {
				updateErrors([])

				toast({
					title: 'Gelukt!',
					message: result.data?.message || 'Het formulier is succesvol verstuurd. Je wordt zo doorgestuurd.',
					type: 'success',
				})

				setTimeout(() => {
					window.location.href = result.data?.redirectTo || '/'
				}, 1000)
			}
		}
	}
</script>

<div class="form-generator">
	<Title {title} {shortTitle} underTitle={description} />

	<form class="form-group" bind:this={form} method="POST" id={formId} use:enhance={enhanceForm}>
		{#each fields as field}
			{#if field.type !== 'hidden'}
				<div class="form-control {field.type === 'table' ? 'form-control-table' : ''}" data-name={field.name} data-type={field.type}>
					{#if field.label}
						<label for={field.name}>
							<Label {field} />
						</label>
					{/if}
					<FieldComponent {field} />
				</div>
			{:else}
				<input type="hidden" name={field.name} value={field.value} />
			{/if}
		{/each}
		<button type="submit" data-testid="submit-btn">
			{submitStr}
		</button>
	</form>
	<p class="error">{generalError}</p>
</div>

<style>
	.error {
		color: red;
		margin: 1rem 0;
	}

	.form-control-table {
		grid-template-columns: 1fr;
	}
</style>

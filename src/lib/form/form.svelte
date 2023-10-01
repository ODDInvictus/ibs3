<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Field, FieldType } from './form-generator';
	import Help from '~icons/tabler/help';
	import { confirm } from '$lib/confirm';
	import { toast } from '$lib/notification';
	import Title from '$lib/components/title.svelte';
	import { offset, flip, shift } from 'svelte-floating-ui/dom';
	import { createFloatingActions } from 'svelte-floating-ui';

	export let title: string;
	export let shortTitle: string | undefined;
	export let description: string;
	export let fields: Field<FieldType>[];
	export let submitStr = 'Verstuur';
	export let formId = 'custom-form';

	export let needsConfirmation: boolean;
	export let confirmText = 'Weet je zeker dat je deze actie wilt uitvoeren?';

	let tooltips = {};
	let show = false;

	const [floatingRef, floatingContent] = createFloatingActions({
		strategy: 'absolute',
		placement: 'left',
		middleware: [offset(6), flip(), shift()]
	});

	let form: HTMLFormElement;
	let generalError = '';

	function updateErrors(errors: { field?: string; message: string }[]) {
		const fields = form.querySelectorAll('.form-control');

		// Loop over all fields
		// data-name is the name of the field

		fields.forEach((field) => {
			const name = field.getAttribute('data-name')!;
			const type = field.getAttribute('data-type')!;

			// Find the error message for this field
			const error = errors.find((e) => e.field === name);

			// Now the error element
			const errorElement = field.querySelector('.form-error')!;

			// select element where name=name
			const input = field.querySelector(`[name="${name}"]`)!;

			// If there is an error, show it
			if (error) {
				input.classList.add('has-error');
				errorElement.textContent = error.message;
			} else {
				input.classList.remove('has-error');
				errorElement.textContent = '';
			}
		});

		// If there is a general error, show it
		const general = errors.find((e) => !e.field);
		if (general) {
			generalError = general.message;
		} else {
			generalError = '';
		}
	}

	async function enhanceForm({ cancel }: { cancel: () => void }) {
		// First check if needsConfirmation is true
		let confirmed = false;

		if (needsConfirmation) {
			// If so, we need to show a confirmation dialog
			confirm({
				title: 'Weet je het zeker?',
				message: confirmText,
				cb: (success) => {
					if (!success) cancel();
					else confirmed = true;
				}
			});
		} else {
			confirmed = true;
		}

		while (!confirmed) {
			// sleep(50)
			await new Promise((resolve) => setTimeout(resolve, 50));
		}

		return async ({ result }: any) => {
			if (result.type === 'failure') {
				// We know now that we have data.errors
				const errors = result.data?.errors;
				const msg = result.data?.message;

				// We can now update the form with the errors
				if (errors && errors.length > 0) updateErrors(errors);
				if (msg) {
					toast({
						title: 'Oei!',
						message: msg,
						type: 'danger'
					});
				}
			} else if (result.type === 'success') {
				updateErrors([]);

				toast({
					title: 'Gelukt!',
					message:
						result.data?.message ||
						'Het formulier is succesvol verstuurd. Je wordt zo doorgestuurd.',
					type: 'success'
				});

				setTimeout(() => {
					window.location.href = result.data?.redirectTo || '/';
				}, 1000);
			}
		};
	}
</script>

<div class="form-generator">
	<Title {title} {shortTitle} underTitle={description} />

	<form class="form-group" bind:this={form} method="POST" id={formId} use:enhance={enhanceForm}>
		{#each fields as field}
			<div class="form-control" data-name={field.name} data-type={field.type}>
				{#if field.type !== 'hidden'}
					<label for={field.name}>
						{field.label}
						{#if field.optional}
							<span class="optional"> (optioneel) </span>
						{/if}
						{#if field.description}
							<i
								role="tooltip"
								class="description"
								on:mouseenter={() => (show = true)}
								on:mouseleave={() => (show = false)}
							>
								<span use:floatingRef>
									<Help />
								</span>
							</i>
							{#if show}
								<div class="tooltip" use:floatingContent>
									{field.description}
								</div>
							{/if}
						{:else}
							<div />
						{/if}
					</label>
				{/if}
				{#if field.type === 'select'}
					<select name={field.name} id={field.name} hidden={field.hidden || false}>
						{#if !field.options}
							<option value="">Geen opties</option>
						{:else}
							{#each field.options as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						{/if}
					</select>
				{:else if field.type === 'checkbox'}
					<input type="checkbox" name={field.name} id={field.name} checked={Boolean(field.value)} />
				{:else if field.type === 'textarea'}
					<textarea
						name={field.name}
						id={field.name}
						placeholder={field.placeholder}
						value={field.value?.toString() || ''}
					/>
				{:else}
					<input
						type={field.type}
						name={field.name}
						id={field.name}
						placeholder={field.placeholder}
						value={field.value || ''}
					/>
				{/if}
				<p id="{field.name}-error" class="form-error" />
			</div>
		{/each}

		<button type="submit">
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
</style>

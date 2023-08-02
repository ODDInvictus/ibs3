<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Field, FieldType } from './form-generator';
	import Help from '~icons/tabler/help';
	import { confirm } from '$lib/confirm';
	import { toast } from '$lib/notification';
	import Title from '$lib/components/title.svelte';

	export let title: string;
	export let description: string;
	export let fields: Field<FieldType>[];
	export let submitStr = 'Verstuur';
	export let formId = 'custom-form';

	export let needsConfirmation: boolean;
	export let confirmText = 'Weet je zeker dat je deze actie wilt uitvoeren?';

	let form: HTMLFormElement;

	function updateErrors(errors: { field: string; message: string }[]) {
		const fields = form.querySelectorAll('.field');

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
	}
</script>

<form
	bind:this={form}
	method="POST"
	id={formId}
	use:enhance={async ({ action, cancel }) => {
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
		}

		while (!confirmed) {
			// sleep(50)
			await new Promise((resolve) => setTimeout(resolve, 50));
		}

		return async ({ result, update }) => {
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
	}}
>
	<Title {title} />

	{#if description}
		<p>{description}</p>
	{/if}
	{#each fields as field}
		<div class="field" data-name={field.name} data-type={field.type}>
			<div class="field-label">
				<label for={field.name} class="form-label">
					{field.label}
					{#if field.optional}
						<span class="required"> (optioneel) </span>
					{/if}
				</label>
				<!-- DESCRIPTION -->
				{#if field.description}
					<div class="field-description" title={field.description}><Help /></div>
				{:else}
					<div />
				{/if}
			</div>
			<div>
				{#if field.type === 'select'}
					<select name={field.name} class="form-select" id={field.name}>
						{#if !field.options}
							<option value="">Geen opties</option>
						{:else}
							{#each field.options as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						{/if}
					</select>
				{:else if field.type === 'checkbox'}
					<input
						type="checkbox"
						class="form-check-input"
						name={field.name}
						id={field.name}
						checked={Boolean(field.value)}
					/>
				{:else if field.type === 'textarea'}
					<textarea
						name={field.name}
						class="form-textarea"
						id={field.name}
						placeholder={field.placeholder}
						value={field.value || ''}
					/>
				{:else}
					<input
						type={field.type}
						name={field.name}
						class="form-control"
						id={field.name}
						placeholder={field.placeholder}
						value={field.value || ''}
					/>
				{/if}
				<p id="{field.name}-error" class="form-error" />
			</div>
		</div>
	{/each}

	<button type="submit">
		{submitStr}
	</button>
</form>
<!-- Dit is hier omdat SvelteKit mijn classes aan het prunen was -->
<div class="has-error placeholder" />

<style lang="scss">
	$border-radius: 0.25rem;
	$row-height: 3rem;
	$padding: 0.25rem;
	$button-padding: 0.5rem;

	p {
		margin: 0.5rem 0;
	}

	.field {
		display: grid;

		grid-template-columns: 200px 1fr;
		gap: 0.5rem;

		min-height: $row-height;

		padding-top: $padding;
		padding-bottom: $padding;

		.field-label {
			display: grid;
			grid-template-columns: 1fr auto;

			.required {
				font-size: smaller;
				color: #666;
			}

			.form-label {
				margin-right: 0.25rem;
				font-weight: 600;
				padding-top: 0.4rem;
			}

			.field-description {
				cursor: help;
				margin-right: 0.25rem;
				margin-top: 0.5rem;
			}
		}

		select,
		textarea,
		input:not([type='checkbox']) {
			width: 100%;
			border: 1px solid var(--border-color);
			border-radius: $border-radius;

			height: $row-height;
		}

		textarea {
			resize: vertical;
			height: calc(2 * $row-height);
		}

		input[type='checkbox'] {
			// change color

			border-radius: $border-radius;
			margin-top: $button-padding;
			margin-bottom: $padding;

			&:checked {
				background-color: var(--primary-color);
			}
		}
	}

	button[type='submit'] {
		padding: 0.5rem 1rem;
		padding-bottom: 2rem;
	}

	.placeholder.has-error {
		display: none;
	}

	.form-error {
		color: red;
	}

	.has-error {
		border: 1px solid red !important;
	}

	.has-error:focus {
		// Red shadow
		box-shadow: 0 0 0 0.25rem rgba(239, 68, 68, 0.25) !important;
	}
</style>

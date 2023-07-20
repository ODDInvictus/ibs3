<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import type { Field, FieldType } from './form-generator';
	import Help from '~icons/tabler/help';

	export let title: string;
	export let description: string;
	export let fields: Field<FieldType>[];
	export let submitStr = 'Verstuur';
	export let formId = 'custom-form';

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

			console.log(input);

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
	use:enhance={({ action, cancel }) => {
		return async ({ result, update }) => {
			console.log({ result, update });

			if (result.type === 'failure') {
				// We know now that we have data.errors
				const errors = result.data?.errors;

				// We can now update the form with the errors
				if (errors.length > 0) updateErrors(errors);
			}
		};
	}}
>
	<h1>{title}</h1>

	<hr />

	<p>{description}</p>
	{#each fields as field}
		<div class="field" data-name={field.name} data-type={field.type}>
			<label for={field.name} class="form-label">{field.label}</label>
			<!-- DESCRIPTION -->
			{#if field.description}
				<div title={field.description}>
					<Help />
				</div>
			{/if}

			{#if field.type === 'select'}
				<select name={field.name} class="form-select" id={field.name}>
					{#each field.options as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			{:else if field.type === 'checkbox'}
				<!-- 																													Dit klopt wel -->
				<input
					type="checkbox"
					class="form-check-input"
					name={field.name}
					id={field.name}
					checked={field.value}
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
	{/each}

	<button type="submit">
		{submitStr}
	</button>

	<!-- Dit is hier omdat SvelteKit mijn classes aan het prunen was -->
	<div class="has-error" />
</form>

<style lang="scss">
	h1 {
		text-align: center;
	}

	hr {
		margin: var(--hr-margin);
	}

	p {
		margin: 0.5rem 0;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.form-error {
		color: red;
	}

	.has-error {
		border: 1px solid red;
	}

	.has-error:focus {
		box-shadow: none;
	}
</style>

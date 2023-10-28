<script lang="ts">
	import Label from './Label.svelte';
	import Error from './Error.svelte';

	import type { z, AnyZodObject } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	type T = $$Generic<AnyZodObject>;

	export let formProps: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let type: 'text' | 'textarea' | 'date' | 'number' = 'text';

	const name = field.toString();

	const { value, errors, constraints } = formFieldProxy(formProps, field);

	// TODO fix types
	function deleteRequired(obj: { required?: boolean; [key: string]: any } | undefined) {
		if (!obj) return obj;
		obj.required = false;
		return obj;
	}
</script>

<!--
  @component
  ```svelte
  <script lang="ts">
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client';
    import SuperField from '$lib/superforms/SuperField.svelte';

    export let data: PageData;

    const formProps = superForm(data.form);
  </script>

  <SuperField {formProps} field="name">Naam</SuperField>
  ```
-->

<div class="input-group">
	<Label {name} {constraints}><slot /></Label>
	{#if type === 'textarea'}
		<textarea
			{name}
			class:has-error={$errors?.length ?? 0 > 0}
			bind:value={$value}
			{...deleteRequired($constraints)}
			{...$$restProps}
		/>
	{:else if type === 'date'}
		<input
			{name}
			type="date"
			class:has-error={$errors?.length ?? 0 > 0}
			bind:value={$value}
			{...deleteRequired($constraints)}
			{...$$restProps}
		/>
	{:else if type === 'number'}
		<input
			{name}
			type="number"
			class:has-error={$errors?.length ?? 0 > 0}
			bind:value={$value}
			{...deleteRequired($constraints)}
			{...$$restProps}
		/>
	{:else if type === 'text'}
		<input
			{name}
			type="text"
			class:has-error={$errors?.length ?? 0 > 0}
			bind:value={$value}
			{...deleteRequired({ ...$constraints })}
			{...$$restProps}
		/>
	{/if}
</div>
<Error {errors} />

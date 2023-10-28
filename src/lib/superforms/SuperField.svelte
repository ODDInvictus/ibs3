<script lang="ts">
	import Label from './Label.svelte';
	import Error from './Error.svelte';

	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { formProps, field } from './types';

	export let formProps: formProps;
	export let field: field;
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

<script lang="ts" context="module">
	import type { AnyZodObject } from 'zod'
	type T = AnyZodObject
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import Label from './Label.svelte'
	import Error from './Error.svelte'

	import type { z } from 'zod'
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms'
	import { dateProxy, formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { Writable } from 'svelte/store'

	export let formProps: SuperForm<ZodValidation<T>, unknown>
	export let field: FormPathLeaves<z.infer<T>>
	export let type: 'text' | 'textarea' | 'date' | 'number' | 'checkbox' = 'text'

	const name = field.toString()

	const { value, errors, constraints } = formFieldProxy(formProps, field)

	const proxyDate =
		type === 'date'
			? dateProxy(formProps.form, field, {
					format: 'date',
				})
			: undefined

	$: boolValue = value as Writable<boolean>

	function deleteRequired(constraints: typeof $constraints) {
		if (constraints) constraints.required = false
		return constraints
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
		<textarea {name} class:has-error={$errors?.length ?? 0 > 0} bind:value={$value} {...deleteRequired($constraints)} {...$$restProps} />
	{:else if type === 'date'}
		<input
			{name}
			type="date"
			class:has-error={$errors?.length ?? 0 > 0}
			bind:value={$proxyDate}
			{...deleteRequired($constraints)}
			{...$$restProps} />
	{:else if type === 'number'}
		<input
			{name}
			type="number"
			class:has-error={$errors?.length ?? 0 > 0}
			bind:value={$value}
			{...deleteRequired($constraints)}
			{...$$restProps} />
	{:else if type === 'text'}
		<input
			{name}
			type="text"
			class:has-error={$errors?.length ?? 0 > 0}
			bind:value={$value}
			{...deleteRequired({ ...$constraints })}
			{...$$restProps} />
	{:else if type === 'checkbox'}
		<input
			{name}
			type="checkbox"
			class:has-error={$errors?.length ?? 0 > 0}
			bind:checked={$boolValue}
			{...deleteRequired($constraints)}
			{...$$restProps} />
	{/if}
</div>
<Error {errors} />

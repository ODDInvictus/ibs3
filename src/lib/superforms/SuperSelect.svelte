<script lang="ts" context="module">
	import type { AnyZodObject } from 'zod';
	type T = AnyZodObject;
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import Label from './Label.svelte';
	import Error from './Error.svelte';

	import type { z } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	export let formProps: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let options: [string | number | undefined, string][] = [];

	const { value, errors, constraints } = formFieldProxy(formProps, field);
	const name = field.toString();
</script>

<div class="input-group">
	<Label {name} {constraints}><slot /></Label>
	<select {name} bind:value={$value} class:has-error={$errors}>
		{#if !$constraints?.required}
			<option value={undefined} selected>-</option>
		{/if}
		{#each options as [value, option]}
			<option {value}>{option}</option>
		{/each}
	</select>
	<Error {errors} />
</div>

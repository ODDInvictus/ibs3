<script lang="ts" module>
	import type { AnyZodObject } from 'zod'
	type T = AnyZodObject
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import Label from './Label.svelte'
	import Error from './Error.svelte'

	import type { z } from 'zod'
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms'
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'

	interface Props {
		formProps: SuperForm<ZodValidation<T>, unknown>
		field: FormPathLeaves<z.infer<T>>
		options?: [string | number | undefined, string][]
		children?: import('svelte').Snippet
	}

	let { formProps, field, options = [], children }: Props = $props()

	const { value, errors, constraints } = formFieldProxy(formProps, field)
	const name = field.toString()
</script>

<div class="input-group">
	<Label {name} {constraints}>{@render children?.()}</Label>
	<select {name} bind:value={$value} class:has-error={$errors} data-testid="{name}-input">
		{#if !$constraints?.required}
			<option value={undefined} selected>-</option>
		{/if}
		{#each options as [value, option]}
			<option {value}>{option}</option>
		{/each}
	</select>
	<Error {errors} />
</div>

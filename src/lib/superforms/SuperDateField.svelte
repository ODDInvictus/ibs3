<script lang="ts">
	import Label from './Label.svelte';
	import Error from './Error.svelte';

	import type { z, AnyZodObject } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	type T = $$Generic<AnyZodObject>;

	export let formProps: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;

	const name = field.toString();

	const { value, errors, constraints } = formFieldProxy(formProps, field);
</script>

<div class="input-group">
	<Label {name} constraints={$constraints}><slot /></Label>
	<input
		{name}
		type="date"
		class:has-error={$errors}
		bind:value={$value}
		{...$constraints}
		{...$$restProps}
	/>
</div>
<Error errors={$errors} />

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
	$errors = [];

	// TODO fix types
	// TODO fix reload
	function deleteRequired(obj: { required?: boolean; [key: string]: any } | undefined) {
		if (!obj) return obj;
		const copy = { ...obj };
		copy.required = false;
		return copy;
	}
</script>

<!--
  @component
  ```svelte
  <script lang="ts">
    import type { PageData } from './$types';
    import { superForm } from 'sveltekit-superforms/client';
    import SuperTextField from '$lib/superforms/SuperTextField.svelte';

    export let data: PageData;

    const formProps = superForm(data.form);
  </script>

  <SuperTextField {formProps} field="name">Naam</SuperTextField>
  ```
-->

<div class="input-group">
	<Label {name} {constraints}><slot /></Label>
	<input
		{name}
		type="text"
		class:has-error={$errors?.length ?? 0 > 0}
		bind:value={$value}
		{...$constraints}
		{...$$restProps}
	/>
</div>
<Error {errors} />

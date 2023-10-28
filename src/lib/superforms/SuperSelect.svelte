<script lang="ts">
	import Label from './Label.svelte';
	import Error from './Error.svelte';
	import { formFieldProxy } from 'sveltekit-superforms/client';
	import type { formProps, field } from './types';

	export let formProps: formProps;
	export let field: field;
	export let options: [string | number, string][] = [];

	const { value, errors, constraints } = formFieldProxy(formProps, field);
	const name = field.toString();
</script>

<div class="input-group">
	<Label {name} {constraints}><slot /></Label>
	<select {name} bind:value={$value}>
		{#each options as [value, option]}
			<option {value}>{option}</option>
		{/each}
	</select>
	<Error {errors} />
</div>

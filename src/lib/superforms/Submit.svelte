<script lang="ts">
	import LoaderElipses from '$lib/components/LoaderElipses.svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { ZodValidation } from 'sveltekit-superforms';

	type T = $$Generic<AnyZodObject>;

	export let formProps: SuperForm<ZodValidation<T>, unknown>;
	const { delayed } = formProps;
</script>

<button type="submit">
	{#if $delayed}
		<LoaderElipses />
	{:else}
		<slot />
	{/if}
</button>

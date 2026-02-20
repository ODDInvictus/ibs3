<script lang="ts">
	import LoaderElipses from '$lib/components/LoaderElipses.svelte'
	import type { SuperForm } from 'sveltekit-superforms/client'
	import type { ZodValidation } from 'sveltekit-superforms'

	type T = $$Generic<AnyZodObject>

	interface Props {
		formProps: SuperForm<ZodValidation<T>, unknown>
		children?: import('svelte').Snippet
		[key: string]: any
	}

	let { formProps, children, ...rest }: Props = $props()
	const { delayed } = formProps
</script>

<button data-testid="submit-btn" {...rest} type="submit">
	{#if $delayed}
		<LoaderElipses />
	{:else}
		{@render children?.()}
	{/if}
</button>

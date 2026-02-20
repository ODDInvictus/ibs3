<script lang="ts">
	import type { Writable } from 'svelte/store'
	import type { InputConstraint } from 'sveltekit-superforms'

	interface Props {
		constraints?: Writable<InputConstraint | undefined> | undefined
		name: string
		children?: import('svelte').Snippet
	}

	let { constraints = undefined, name, children }: Props = $props()
</script>

<label for={name} class="input-label">
	{@render children?.()}
	{#if !$constraints?.required}
		<span class="optional">(Optioneel)</span>
	{/if}
</label>

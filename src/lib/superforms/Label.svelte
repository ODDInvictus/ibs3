<script lang="ts">
	import type { Writable } from 'svelte/store'
	import type { InputConstraint } from 'sveltekit-superforms'

	export let constraints: Writable<InputConstraint | undefined> | undefined = undefined
	export let name: string
</script>

<label for={name} class="input-label">
	<slot />
	{#if !$constraints?.required}
		<span class="optional">(Optioneel)</span>
	{/if}
</label>

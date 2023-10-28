<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { InputConstraint } from 'sveltekit-superforms';

	export let constraints: Writable<InputConstraint | undefined>;
	export let name: string;
</script>

<label for={name}>
	<slot />
	{#if !$constraints?.required}
		<span class="optional">(Optioneel)</span>
	{/if}
</label>

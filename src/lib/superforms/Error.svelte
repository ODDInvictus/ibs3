<script lang="ts">
	import type { Writable } from 'svelte/store'

	interface Props {
		errors: Writable<string[] | undefined>
	}

	let { errors }: Props = $props()
</script>

{#if $errors}<span class="form-error">{$errors}</span>{/if}

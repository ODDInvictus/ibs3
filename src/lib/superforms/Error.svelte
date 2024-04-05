<script lang="ts">
	import type { Writable } from 'svelte/store'

	export let errors: Writable<string[] | undefined>
</script>

{#if $errors}<span class="form-error">{$errors}</span>{/if}

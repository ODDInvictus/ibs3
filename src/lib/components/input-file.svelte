<script lang="ts">
	import { string } from 'zod';

	export let name: string;
	export let id: string;
	let files: FileList | null;
</script>

<div class="input-file {$$props.class ?? ''}">
	{#if files && files[0]}
		<div class="has-file">
			{files[0].name}
			<button class="btn-a" on:click={() => (files = null)}>Reset</button>
		</div>
	{:else}
		<div class="no-file">
			<label for={name}>Selecteer een bestand...</label>
		</div>
	{/if}
	<input bind:files type="file" {id} {name} />
</div>

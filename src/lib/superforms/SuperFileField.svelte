<script lang="ts">
	export let name: string
	export let files: FileList | undefined = undefined
	export let value = ''
</script>

<div class="input-group">
	<label for={name}><slot /></label>
	<input type="file" {name} {...$$restProps} bind:files bind:value />
</div>

<style>
	input[type='file'] {
		line-height: 2.5rem;
	}
</style>

<script lang="ts">
	export let name: string;
	export let files: FileList;
</script>

<div class="input-group">
	<label for={name}><slot /></label>
	<input type="file" {name} {...$$restProps} bind:files />
</div>

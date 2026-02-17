<script lang="ts">
	interface Props {
		name: string
		files?: FileList | undefined
		value?: string
		children?: import('svelte').Snippet
		[key: string]: any
	}

	let { name, files = $bindable(undefined), value = $bindable(''), children, ...rest }: Props = $props()
</script>

<div class="input-group">
	<label for={name}>{@render children?.()}</label>
	<input type="file" {name} {...rest} bind:files bind:value />
</div>

<style>
	input[type='file'] {
		line-height: 2.5rem;
	}
</style>

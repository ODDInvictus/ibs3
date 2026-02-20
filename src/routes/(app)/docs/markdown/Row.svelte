<script lang="ts">
	import { markdown } from '$lib/utils'

	interface Props {
		text: string
	}

	let { text }: Props = $props()
</script>

<tr>
	<td>{text}</td>
	<td>{@html markdown(text)}</td>
</tr>

<style>
</style>

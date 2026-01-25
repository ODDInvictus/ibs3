<script lang="ts">
	import Base from './Base.svelte'
	import { env } from '$env/dynamic/private'

	export let text: string
</script>

<Base {...$$props}>
	<p>
		{text}
	</p>
</Base>

<script lang="ts">
	import { rpc } from '$lib/rpc'
	import type { PageData } from './$types'

	export let data: PageData

	async function click() {
		await rpc<null, null>('test', null)
	}
</script>

<button on:click={click}> Test </button>

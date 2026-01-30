<script lang="ts">
	import { rpc } from '$lib/rpc'
	import type { PageData } from './$types'

	export let data: PageData

	let selection: string = data.nts[0]
	let discord: boolean = true

	async function click() {
		await rpc<{ selection: string; discord: boolean }, null>('test', { selection, discord })
	}
</script>

<div class="page">
	<div>
		<select bind:value={selection}>
			{#each data.nts as nt}
				<option value={nt}>{nt}</option>
			{/each}
		</select>
	</div>

	<div>
		<label for="discord">
			Discord
			<input name="discord" type="checkbox" bind:checked={discord} />
		</label>
	</div>

	<div>
		<button on:click={click}> Stuur </button>
	</div>
</div>

<style lang="scss">
	.page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		max-width: fit-content;
	}
</style>

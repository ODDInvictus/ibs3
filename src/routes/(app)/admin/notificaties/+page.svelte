<script lang="ts">
	import { rpc } from '$lib/rpc'
	import type { PageData } from './$types'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()

	let selection: string = $state(data.nts[0])
	let discord: boolean = $state(true)
	let everyone: boolean = $state(false)

	async function click() {
		await rpc<{ selection: string; discord: boolean; everyone: boolean }, null>('test', { selection, discord, everyone })
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
		<label for="everyone">
			Naar elke gebruiker sturen?
			<input name="everyone" type="checkbox" bind:checked={everyone} />
		</label>
	</div>

	<div>
		<button onclick={click}> Stuur </button>
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

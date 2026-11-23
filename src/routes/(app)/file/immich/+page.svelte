<script lang="ts">
	import { getAssetBlob } from '$lib/immich.remote'
	import type { PageProps } from './$types'

	let { data }: PageProps = $props()
</script>

<div>
	{#each data.data as asset}
		<img src={await getAssetBlob(asset.id)} alt={'foto'} />
		<table>
			<thead>
				<tr>
					<th>Key</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>
				{#each Object.entries(asset) as d}
					<tr>
						<td>{d[0]}</td>
						<td>{JSON.stringify(d[1])}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<br />
	{/each}
</div>

<style lang="scss">
	img {
		max-width: 400px;
	}
</style>

<script lang="ts">
	import { getPictureUrl } from '$lib/utils'

	export let previews: {
		src?: string
		filename: string
	}[] = []
	export let toDelete: string[] = []
	export let noDelete = false

	let selected = 0
</script>

<div class="preview">
	<div class="selector">
		{#each previews as preview, i}
			<button class="nav-item btn-secondary" class:selected={selected === i} type="button">
				<span on:click={() => (selected = i)} class="select">
					{preview.filename.length > 20 ? preview.filename.slice(0, 20) + '...' : preview.filename}
				</span>
				{#if !noDelete}
					<span
						on:click={() => {
							toDelete = [...toDelete, previews[i].filename]
							previews = previews.filter((_, j) => j !== i)
							selected = 0
						}}>
						x
					</span>
				{/if}
			</button>
		{/each}
	</div>
	{#if previews.length === 0}
		<p>Geen bijlagen</p>
	{:else}
		{@const { filename } = previews[selected]}
		{@const src = previews[selected].src ?? getPictureUrl(filename)}
		{@const fileExtention = filename.split('.').pop()?.split('?').shift()?.toLowerCase() ?? ''}
		<p class="small">
			{filename.length > 40 ? filename.slice(0, 40) + '...' : filename}
		</p>
		{#if ['png', 'jpg', 'jpeg', 'gif', 'avif'].includes(fileExtention)}
			<img {src} alt={filename} />
		{:else if fileExtention === 'pdf'}
			<iframe {src} title={filename} />
		{:else}
			<a href={src} download={filename} class="button download"> Download </a>
		{/if}
	{/if}
</div>

<style lang="scss">
	iframe,
	img {
		width: 100%;
		max-width: 600px;
	}

	iframe {
		height: 800px;
	}

	img {
		object-fit: contain;
		object-position: left top;
		border: 3px solid gray;
		max-height: 800px;
	}

	.download {
		width: fit-content;
	}

	.nav-item {
		cursor: default;
		display: flex;

		.select {
			margin-right: 1ex;
		}

		span {
			cursor: pointer;

			&:hover {
				text-decoration: underline;
			}
		}

		&:hover {
			text-decoration: none;
		}

		&.selected {
			outline: 3px solid var(--color-primary);
		}
	}

	.small {
		font-size: 0.8rem;
	}

	.selector {
		display: flex;
		flex-direction: row;
		widows: 100%;
		gap: 1ex;
		padding: 1rem;
	}

	.preview {
		display: flex;
		flex-direction: column;
	}
</style>

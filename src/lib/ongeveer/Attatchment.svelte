<script lang="ts">
	export let previews: {
		src: string;
		MIMEtype: string;
		size: string;
		name: string;
	}[] = [];
	export let toDelete: string[] = [];
	export let noDelete = false;

	let selected = 0;
</script>

<div class="preview">
	<div class="selector">
		{#each previews as preview, i}
			<button class="nav-item btn-secondary" class:selected={selected === i} type="button">
				<span on:click={() => (selected = i)} class="select">
					{preview.name.match(/^purchase-\d+-.*/)
						? preview.name.split('-').slice(2).join('-')
						: preview.name}
				</span>
				{#if !noDelete}
					<span
						on:click={() => {
							toDelete = [...toDelete, previews[i].name];
							previews = previews.filter((_, j) => j !== i);
							selected = 0;
						}}
					>
						x
					</span>
				{/if}
			</button>
		{/each}
	</div>
	<p class="small">{previews[selected].name} ({previews[selected].size})</p>
	{#if previews[selected].MIMEtype.startsWith('image/')}
		<img src={previews[selected].src} alt={previews[selected].name} />
	{:else if previews[selected].MIMEtype === 'application/pdf'}
		<iframe src={previews[selected].src} title={previews[selected].name} />
	{:else}
		<a href={previews[selected].src} download={previews[selected].name} class="button download">
			Download
		</a>
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

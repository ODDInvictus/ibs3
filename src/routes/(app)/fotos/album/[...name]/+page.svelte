<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { imagePreview } from '$lib/imagePreviewStore';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if !data.type}
	<Title title="Album niet gevonden" />
{:else}
	<Title
		markdown
		title="Album: {data.title}"
		underTitle="Tip: Klik op een foto om hem te vergroten"
	/>
	{@const photos = (data.type === 'activity' ? data.activity?.photos : []) ?? []}

	{#if photos.length === 0}
		<p>Er zijn nog geen foto's in dit album</p>
	{:else}
		<div class="gallery">
			{#each photos as photo}
				{@const url = `/fotos/${photo.filename}-small.avif`}
				<figure class="photo">
					<img
						src="/fotos/{photo.filename}-small.avif"
						alt={photo.description}
						on:click={() => imagePreview({ image: `/fotos/${photo.filename}-large.avif` })}
					/>
				</figure>
			{/each}
		</div>
	{/if}
{/if}

<style lang="scss">
	.gallery {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 1rem;
	}

	.photo {
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			aspect-ratio: 1 / 1;
		}
	}
</style>

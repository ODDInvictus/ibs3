<script lang="ts">
	import { goto } from '$app/navigation'
	import Title from '$lib/components/title.svelte'
	import { imagePreview } from '$lib/imagePreviewStore'
	import { getPictureUrl } from '$lib/utils'
	import type { PageData } from './$types'

	export let data: PageData
</script>

{#if !data.type}
	<Title title="Album niet gevonden" />
{:else}
	<Title markdown title="{data.title} - Album" underTitle="Tip: Klik op een foto om hem te vergroten" />
	{@const photos = (data.type === 'activity' ? data.activity?.photos : data.photos) ?? []}

	{#if photos.length === 0}
		<p>Er zijn nog geen foto's in dit album</p>
	{:else}
		<div class="gallery">
			{#each photos as photo}
				<figure class="photo">
					<img
						src={getPictureUrl(photo.file.filename, 'thumbnail')}
						alt={photo.description}
						on:click={() => imagePreview({ image: getPictureUrl(photo.file.filename, 'normal') })} />
					<figcaption>
						<a href="/fotos/{photo.id}">{photo.description ?? 'Info'}</a>
					</figcaption>
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
			object-fit: cover;
			aspect-ratio: 1 / 1;
		}
	}

	@media (max-width: 600px) {
		.gallery {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>

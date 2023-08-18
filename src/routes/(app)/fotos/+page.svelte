<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { imagePreview } from '$lib/imagePreviewStore';
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data);
</script>

<Title title="Foto's" />

<div class="buttons">
	<a href="/fotos/upload">Foto's uploaden</a>
	<a href="/fotos/slideshow">Slideshow</a>
</div>

<div class="main">
	<div class="ibs-card tags" />

	<div class="ibs-card photo-highlight">
		<h2 class="ibs-card--title">Foto highlight!</h2>

		<div class="ibs-card--content">
			<div on:click={() => imagePreview({ image: `/fotos/${data.highlight.filename}-large.avif` })}>
				<img src="/fotos/{data.highlight.filename}-large.avif" alt="Foto van de Dag" />
			</div>
			<p>Gemaakt door {data.highlight.name}</p>
		</div>
		<div class="ibs-card--buttons">
			<a href="/fotos/{data.highlight.pid}">Meer informatie</a>
		</div>
	</div>
</div>

<style lang="scss">
	.buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		gap: 0.5rem;
	}

	.main {
		margin-top: 1rem;

		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}

	.ibs-card.photo-highlight {
		grid-column: 2;

		& .ibs-card--content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		img {
			height: 300px;
		}
	}
</style>

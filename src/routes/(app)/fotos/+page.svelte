<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { imagePreview } from '$lib/imagePreviewStore';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Title title="Foto's" />

<div class="buttons">
	<a href="/fotos/upload">Foto's uploaden</a>
	<a href="/fotos/slideshow">Slideshow</a>
</div>

<div class="main">
	<div class="ibs-card nav">
		<h2 class="ibs-card--title">Navigatie</h2>

		<div class="ibs-card--content">
			<a href="/fotos/activiteit">Per activiteit</a>
			<br />
			<a href="/fotos/alles">Tags</a>
		</div>
	</div>

	<div class="ibs-card photo-highlight">
		<h2 class="ibs-card--title">Foto highlight!</h2>

		<div class="ibs-card--content">
			{#if data.highlight}
				<div
					on:click={() => imagePreview({ image: `/fotos/${data.highlight.filename}-large.avif` })}
				>
					<img src="/fotos/{data.highlight.filename}-large.avif" alt="Foto van de Dag" />
				</div>
				<p>Gemaakt door {data.highlight.name}</p>
				<div class="ibs-card--buttons">
					<a href="/fotos/{data.highlight.pid}">Meer informatie</a>
				</div>
			{:else}
				<p>Er is nog geen foto van de dag</p>
			{/if}
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

	@media (max-width: 600px) {
		.main {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.ibs-card.photo-highlight {
			grid-row: 1;
			grid-column: 1;
			max-width: calc(100vw - 2rem);

			img {
				max-width: 100%;
				max-height: 40vh;
				height: auto;
			}
		}

		.ibs-card.nav {
			grid-row: 2;
		}
	}
</style>

<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte'
	import Title from '$lib/components/title.svelte'
	import { imagePreview } from '$lib/imagePreviewStore'
	import { activitySlug } from '$lib/textUtils'
	import { getPictureUrl, markdown, stripMarkdown } from '$lib/utils'
	import type { PageData } from './$types'

	export let data: PageData

	let activityCount = 0
</script>

<Title title="Foto's" />

<div class="main">
	<div class="ibs-card nav">
		<h2 class="ibs-card--title">Navigatie</h2>

		<div class="ibs-card--content">
			<a class="button" href="/fotos/tags">Fotos per tag</a>
			<a class="button" href="/fotos/album/alles">Alle foto's</a>
			<a class="button" href="/fotos/album/geen-tags">Foto's zonder tag</a>
			<a class="button btn-info" href="/fotos/upload">Upload foto's </a>
			<a class="button btn-secondary" href="/fotos/slideshow">Slideshow</a>
		</div>
	</div>

	<div class="ibs-card photo-highlight">
		<h2 class="ibs-card--title">Foto highlight!</h2>

		<div class="ibs-card--content">
			{#if data.highlight}
				<div on:click={() => imagePreview({ image: getPictureUrl(data.highlight.filename, 'normal') })}>
					<img src={getPictureUrl(data.highlight.filename, 'thumbnail')} alt="Foto van de Dag" />
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

	<div class="ibs-card">
		<h2 class="ibs-card--title">Nieuwste activiteiten</h2>
		<div class="ibs-card--content">
			{#each data.activities as act}
				{#if act._count.photos > 0}
					<a href="/fotos/album/{activitySlug(stripMarkdown(act.name))}/{act.id}">
						{@html markdown(act.name)} ({act._count.photos})
					</a>
					<br />
				{/if}
			{/each}
			<a href="/fotos/activiteit">Meer activiteiten</a>
		</div>
	</div>
</div>

<style lang="scss">
	.main {
		margin-top: 1rem;

		display: grid;
		grid-template-columns: 5fr 8fr;
		grid-template-rows: 1fr 1fr 1fr;
		gap: 1rem;

		a {
			min-height: 0;
			overflow: hidden;
		}
	}

	.nav {
		max-width: 100%;

		.ibs-card--content {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.5rem;
		}
	}

	.ibs-card.photo-highlight {
		grid-column: 2;
		grid-row: span 2;

		width: 100%;

		& .ibs-card--content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		img {
			object-fit: contain;
			max-width: 100%;
			max-height: 300px;
		}
	}

	@media (max-width: 600px) {
		.main {
			grid-template-columns: 1fr;
			grid-template-rows: auto;
			gap: 1rem;
		}

		.nav {
			.ibs-card--content {
				display: grid;
				grid-template-columns: minmax(0, 1fr);
				gap: 0.5rem;
			}
		}

		.ibs-card.photo-highlight {
			grid-row: 1;
			grid-column: 1;
			max-width: calc(100vw - 2rem);

			img {
				max-height: 40vh;
				height: auto;
			}
		}

		.ibs-card.nav {
			grid-row: 2;
		}
	}
</style>

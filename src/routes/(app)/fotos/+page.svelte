<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data);
</script>

<Title title="Foto's" />

<div class="buttons">
	<a href="./upload">Foto's uploaden</a>
	<a href="./slideshow">Slideshow</a>
</div>

<div class="main">
	<div class="ibs-card photo-of-the-day">
		<h2 class="ibs-card--title">Foto van de dag!</h2>

		<div class="ibs-card--content">
			<img src="/fotos/{data.photoOfTheDay.filename}-large.avif" alt="Foto van de Dag" />
			<p>Gemaakt door {data.photoOfTheDay.name}</p>
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

	.ibs-card.photo-of-the-day {
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

<script lang="ts">
	import Title from '$lib/components/title.svelte';
	import { imagePreview } from '$lib/imagePreviewStore';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if !data.photo}
	<Title title="Foto niet gevonden" />
{:else}
	<Title title={data.photo.description ?? `Foto ${data.photo.id}`} />

	<div class="root">
		<div class="details-container">
			<h2>Details</h2>
			<p>Beschrijving: {data.photo.description}</p>
			<p>Gemaakt door: {data.photo.creator?.name}</p>
			<p>
				Mensen in deze foto:
				{#if data.photo.peopleTagged.length === 0}
					niemand
				{:else}
					{#each data.photo.peopleTagged as person}
						<a href="/leden/{person.user.ldapId}">{person.user.firstName}</a>&nbsp;
					{/each}
				{/if}
			</p>

			<p class="mb-1">Tags:</p>
			{#each data.photo.tags as tag}
				<span class="ibs-chip">{tag.photoTag.name}</span>
			{/each}

			<hr />

			<div class="quality-container">
				<h2>Kwaliteit</h2>
				<a href="?quality=klein" class="btn-a">SD</a>
				<a href="?quality=normaal" class="btn-a">HD</a>
				<a href="?quality=groot" class="btn-a">FHD</a>
				<a href="?quality=origineel" class="btn-a">Origineel</a>
			</div>
			<small>
				Met rechtermuisknop -> opslaan kan je deze downloaden in de geselecteerde kwaliteit
			</small>

			<hr />

			<div class="comment-container">
				<h2>Comments</h2>

				{#each data.photo.comments as comment}
					<div class="ibs-comment">
						<div class="ibs-comment--user">
							{comment.commenter.firstName}
						</div>
						<div class="ibs-comment--content">
							{comment.comment}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="image-container">
			<img
				on:click={() =>
					imagePreview({
						image: data.photoUrl ?? ''
					})}
				src={data.photoUrl}
				alt="Foto {data.photo.id}"
			/>
		</div>
	</div>
{/if}

<style lang="scss">
	.root {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 1rem;

		h2 {
			margin-bottom: 0.25rem;
		}
	}

	.details-container {
		p {
			margin: 0.25rem 0;
		}
	}

	.image-container {
		grid-column: span 2;

		img {
			max-width: 100%;
			max-height: calc(100vh - var(--topbar-height) - 10rem);
		}
	}
</style>

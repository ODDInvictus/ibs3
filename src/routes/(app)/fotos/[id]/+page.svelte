<script lang="ts">
	import { enhance } from '$app/forms';
	import ProfileIcon from '$lib/components/profile-icon.svelte';
	import Title from '$lib/components/title.svelte';
	import { formatDateHumanReadable, formatDateTimeHumanReadable } from '$lib/dateUtils';
	import { imagePreview } from '$lib/imagePreviewStore';
	import { toast } from '$lib/notification';
	import type { PageData } from './$types';
	import Star from '~icons/tabler/star';

	export let data: PageData;

	let rating = data.avgRating ?? 0;
	let starHovered = rating;

	console.log(rating);

	async function rate() {
		let newRating = starHovered;

		await fetch('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				type: 'rating',
				rating: newRating
			})
		})
			.then((res) => res.json())
			.then((res) => {
				toast({
					title: res.success ? 'Gelukt!' : 'Opslaan mislukt',
					message: res.message,
					type: res.success ? 'info' : 'danger'
				});
				if (res.success) {
					rating = newRating;
					starHovered = newRating;
					data.avgRating = res.data;
				}
			});
	}
</script>

{#if !data.photo}
	<Title title="Foto niet gevonden" />
{:else}
	<Title
		shortTitle={`${data.photo.description} - Foto` ?? `Foto ${data.photo.id}`}
		title={`${data.photo.description}` ?? `Foto ${data.photo.id}`}
	/>

	<div class="root">
		<div class="details-container">
			<h2>Details</h2>
			<p>Beschrijving: {data.photo.description}</p>
			<p>Gemaakt door: {data.photo.creator?.name}</p>
			{#if data.photo.date}
				<p>Datum: {formatDateHumanReadable(data.photo.date)}</p>
			{/if}
			<p>
				Invicti in deze foto:
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

			<div class="rating-container">
				<h2>Wat vind je van deze foto?</h2>
				<div class="stars" data-hovered={starHovered}>
					{#each Array.from(Array(5).keys()) as idx}
						<i
							on:focus={() => (starHovered = idx + 1)}
							on:mouseover={() => (starHovered = idx + 1)}
							on:focusout={() => (starHovered = rating)}
							on:mouseleave={() => (starHovered = rating)}
							on:click={rate}
							data-filled={starHovered >= idx + 1}><Star /></i
						>
					{/each}
				</div>
				<small>
					{#if isNaN(data.avgRating)}
						Nog geen stemmen. Wees de eerste!
					{:else}
						Gemiddelde mening: {data.avgRating}
					{/if}
				</small>
			</div>

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
				<h2>Reacties</h2>

				<form
					method="POST"
					use:enhance={() => {
						return ({ result, update }) => {
							let title = 'Reactie plaatsen mislukt';
							let type = 'danger';

							if (result.status === 200) {
								title = 'Succes';
								type = 'success';

								// @ts-expect-error Ja weet je, ik snap dat je dit niet leuk vind, maar je doet het er maar mee typescript
								data.photo.comments = [...data.photo.comments, result.data.comment];
							}

							toast({
								title,
								message: result.data.message,
								type
							});
							update();
						};
					}}
				>
					<input type="text" name="comment" placeholder="Typ een reactie..." />
					<button type="submit">Plaats</button>
				</form>

				{#each data.photo.comments as comment}
					{@const u = comment.commenter}
					<div class="ibs-comment">
						<div class="ibs-comment--icon">
							<ProfileIcon
								src={u.picture}
								name={u.firstName + ' ' + u.lastName}
								height={50}
								width={50}
							/>
						</div>
						<div class="ibs-comment--content">
							<a href="/leden/{u.ldapId}" class="ibs-comment--content--name"
								>{u.firstName} {u.lastName}</a
							>
							<p class="ibs-comment--content--date">
								{formatDateTimeHumanReadable(comment.updatedAt)}
							</p>
							<div class="ibs-comment--content--comment">{comment.comment}</div>
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

	.comment-container {
		max-width: 100%;

		form {
			display: grid;
			grid-template-columns: 1fr auto;
			grid-gap: 1rem;
			margin: 0.5rem 0;
		}
	}

	.image-container {
		grid-column: span 2;

		img {
			max-width: 100%;
			max-height: calc(100vh - var(--topbar-height) - 10rem);
		}
	}

	.rating-container {
		.stars {
			i {
				color: var(--color-primary);
			}

			i[data-filled='true'],
			i:hover {
				& :global(path) {
					fill: var(--color-primary);
				}
			}
		}
	}

	@media (max-width: 600px) {
		$mw: calc(100vw - 2rem);

		.root {
			grid-template-columns: 1fr;

			& > div {
				max-width: $mw;
			}
		}

		.details-container {
			grid-row: 2;
			grid-column: span 1;
		}

		.comment-container {
			form {
				grid-template-columns: minmax(0, 1fr);
				margin-bottom: 1rem;
			}
		}

		.image-container {
			grid-row: 1;
			grid-column: span 1;

			max-width: $mw;
		}
	}
</style>
